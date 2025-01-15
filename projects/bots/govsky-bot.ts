import { AtpAgent, RichText } from "@atproto/api";
import { BotConfig } from "./types";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { ApiUser } from "@govsky/api/types";
import { ListItemView } from "@atproto/api/dist/client/types/app/bsky/graph/defs";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export class GovskyBot {
  private static bots = new Map<string, GovskyBot>();
  private readonly atpAgent = new AtpAgent({ service: "https://bsky.social" });
  private botDid?: string;

  constructor(
    private readonly config: BotConfig,
    private readonly readOnly: boolean
  ) {
    if (GovskyBot.bots.has(config.handle)) {
      return GovskyBot.bots.get(config.handle) as GovskyBot;
    }
    GovskyBot.bots.set(config.handle, this);
  }

  private rateLimitDelay() {
    return delay(500);
  }

  private logReadOnly(action: string) {
    console.log(`Read-only mode, skipping action: ${action}`);
  }

  private async addUserToList(userDid: string, listUri: string) {
    if (!this.botDid) {
      throw new Error("Bot must be logged in");
    }

    if (this.readOnly) {
      return this.logReadOnly("add user to list");
    }

    await this.atpAgent.com.atproto.repo.createRecord({
      collection: "app.bsky.graph.listitem",
      record: {
        $type: "app.bsky.graph.listitem",
        createdAt: new Date().toISOString(),
        list: listUri,
        subject: userDid,
      },
      repo: this.botDid,
    });

    await this.rateLimitDelay();
  }

  async addOrRemoveFromLists(users: ApiUser[]) {
    if (!this.config.lists?.length) {
      console.log("No lists configured");
      return;
    }
    const userSet = new Set(users.map((u) => u.did));

    for (const list of this.config.lists) {
      console.log(`List: ${list.description}:`);
      const listMembers = await this.getListMembers(list.uri);
      const listMemberSet = new Set(listMembers.map((m) => m.subject.did));
      let addCount = 0;
      let removeCount = 0;

      // Remove users as appropriate
      for (const member of listMembers) {
        if (
          !userSet.has(member.subject.did) ||
          !list.addHandleToListTest(member.subject.handle)
        ) {
          console.log(
            `Removing user ${member.subject.handle} from list ${list.description}`
          );
          await this.removeUserFromList(member);
          removeCount++;
        }
      }
      // Add users as appropriate
      for (const user of users) {
        if (
          list.addHandleToListTest(user.handle) &&
          !listMemberSet.has(user.did)
        ) {
          console.log(`Adding user ${user.handle} to list ${list.description}`);
          await this.addUserToList(user.did, list.uri);
          addCount++;
        }
      }

      console.log(`${addCount} added, ${removeCount} removed`);
    }
  }

  async removeUserFromList(listItem: ListItemView) {
    if (!this.botDid) {
      throw new Error("But must be logged in");
    }

    if (this.readOnly) {
      return this.logReadOnly("remove user from list");
    }

    const [rkey] = listItem.uri.split("/").reverse();

    await this.atpAgent.com.atproto.repo.deleteRecord({
      rkey,
      collection: "app.bsky.graph.listitem",
      repo: this.botDid,
    });

    await this.rateLimitDelay();
  }

  async followOrUnfollow(users: ApiUser[]) {
    const { toAdd, toRemove } = await this.getUsersToAddOrRemove(users);
    let followedCount = 0;
    let unfollowedCount = 0;
    // Follow and announce
    for (const user of toAdd) {
      console.log(`Following ${user.handle}`);
      await this.followAndAnnounce(user);
      followedCount++;
    }

    // Unfollow
    for (const user of toRemove) {
      console.log(`Unfollowing ${user.handle}`);
      await this.unfollow(user);
      unfollowedCount++;
    }

    console.log(`${followedCount} followed, ${unfollowedCount} unfollowed`);
  }

  async unfollow(user: ApiUser) {
    if (this.readOnly) {
      return this.logReadOnly("unfollow user");
    }

    await this.atpAgent.deleteFollow(user.did);

    await this.rateLimitDelay();
  }

  async followAndAnnounce(user: ApiUser) {
    if (this.readOnly) {
      return this.logReadOnly("follow and announce user");
    }

    await this.atpAgent.follow(user.did);
    const rt = new RichText({ text: this.config.welcomeMessage(user) });
    await rt.detectFacets(this.atpAgent);
    await this.atpAgent.post({ text: rt.text, facets: rt.facets });
    await this.rateLimitDelay();
  }

  async getUsersToAddOrRemove(users: ApiUser[]) {
    const ownFollowing: ApiUser[] = (await this.getOwnFollowing()).map(
      (el) => ({
        did: el.did,
        handle: el.handle,
        displayName: el.displayName || null,
      })
    );
    const newUsers = new Set(users.map((u) => u.did));
    const existingUsers = new Set(ownFollowing.map((u) => u.did));
    const toAdd = users.filter((u) => !existingUsers.has(u.did));
    const toRemove = ownFollowing.filter((u) => !newUsers.has(u.did));
    return { toAdd, toRemove };
  }

  async getListMembers(listUri: string) {
    let listCursor;
    const listItems: ListItemView[] = [];
    do {
      const list = await this.atpAgent.app.bsky.graph.getList({
        list: listUri,
        limit: 100,
        cursor: listCursor,
      });
      listItems.push(...list.data.items);
      listCursor = list.data.cursor;
    } while (listCursor);
    return listItems;
  }

  async getOwnFollowing() {
    if (!this.botDid) {
      throw new Error("Bot must be logged-in");
    }

    let cursor: string | undefined;
    const follows: ProfileView[] = [];

    do {
      const res = await this.atpAgent.getFollows({
        actor: this.botDid,
        limit: 100,
        cursor,
      });
      cursor = res.data.cursor;
      follows.push(...res.data.follows);
    } while (cursor);

    return follows;
  }

  async login() {
    if (this.botDid) {
      // Probably logged in. Let's make sure.
      const me = await this.atpAgent.getProfile();
      if (me.data.did === this.botDid) {
        console.log("Already logged in, skipping auth");
        return;
      }
    }

    const me = await this.atpAgent.login({
      identifier: this.config.handle,
      password: this.config.password,
    });
    this.botDid = me.data.did;
  }
}
