import { AtpAgent, RichText } from "@atproto/api";
import { BotConfig } from "./types";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
import { ApiUser } from "@govsky/api/types";
import { ListItemView } from "@atproto/api/dist/client/types/app/bsky/graph/defs";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

type AddOrRemove = { toAdd: ApiUser[]; toRemove: ApiUser[] };

export class GovskyBot {
  private readonly atpAgent = new AtpAgent({ service: "https://bsky.social" });
  private botDid?: string;

  constructor(private readonly config: BotConfig) {}

  private async addUserToList(userDid: string, listUri: string) {
    if (!this.botDid) {
      throw new Error("Bot must be logged in");
    }

    return this.atpAgent.com.atproto.repo.createRecord({
      collection: "app.bsky.graph.listitem",
      record: {
        $type: "app.bsky.graph.listitem",
        createdAt: new Date().toISOString(),
        list: listUri,
        subject: userDid,
      },
      repo: this.botDid,
    });
  }

  async addOrRemoveFromLists({ toAdd, toRemove }: AddOrRemove) {
    if (!this.config.lists) return;
    for (const list of this.config.lists) {
      const listMembers = await this.getListMembers(list.uri);
      const listMemberSet = new Set(listMembers.map((u) => u.subject.did));
      const toAddToList = toAdd.filter(
        (u) => list.addHandleToListTest(u.handle) && !listMemberSet.has(u.did)
      );
      const toRemoveFromList = toRemove.filter((u) => listMemberSet.has(u.did));
      for (const user of toAddToList) {
        console.log(`Adding user ${user.handle} to list ${list.description}`);
        await this.addUserToList(user.did, list.uri);
        await delay(500);
      }
    }
  }

  async followOrUnfollow({ toAdd, toRemove }: AddOrRemove) {
    // Follow and announce
    for (const user of toAdd) {
      console.log(`Following ${user.handle}`);
      await this.atpAgent.follow(user.did);
      const rt = new RichText({ text: this.config.welcomeMessage(user) });
      await rt.detectFacets(this.atpAgent);
      await this.atpAgent.post({ text: rt.text, facets: rt.facets });
      await delay(500);
    }

    // Unfollow
    for (const user of toRemove) {
      await this.atpAgent.deleteFollow(user.did);
      await delay(500);
    }
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
    const me = await this.atpAgent.login({
      identifier: this.config.handle,
      password: this.config.password,
    });
    this.botDid = me.data.did;
  }
}
