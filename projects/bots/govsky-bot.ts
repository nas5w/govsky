import { AtpAgent, RichText } from "@atproto/api";
import { BotConfig } from "./types";
import { ProfileView } from "@atproto/api/dist/client/types/app/bsky/actor/defs";

export class GovskyBot {
  private readonly atpAgent = new AtpAgent({ service: "https://bsky.social" });
  private botDid?: string;

  constructor(private readonly config: BotConfig) {}

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
