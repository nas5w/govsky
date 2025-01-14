import dotenv from "dotenv";
import cron from "node-cron";
import { config } from "@govsky/config";
import { BotConfig } from "./types";
import { GovskyBot } from "./govsky-bot";
import { ApiUser } from "@govsky/api/types";
import { getUserForAllDomains } from "./helpers";

dotenv.config();

const bots: BotConfig[] = [
  {
    name: "Govsky US",
    handle: process.env.GOVSKY_US_HANDLE || "",
    password: process.env.GOVSKY_US_PW || "",
    domains: config.us.domains,
    welcomeMessage: (user: ApiUser) => {
      const name = user.displayName
        ? `${user.displayName} (@${user.handle})`
        : user.handle;
      return `${name} has joined Bluesky! #govsky`;
    },
    lists: [
      {
        description: "All gov",
        uri: "at://did:plc:pe365hgnkisv4rhrcow7m5ue/app.bsky.graph.list/3lf3xwfybxl2j",
        addHandleToListTest: () => true,
      },
      {
        description: "No congress",
        uri: "at://did:plc:pe365hgnkisv4rhrcow7m5ue/app.bsky.graph.list/3lf6am7kaxb2n",
        addHandleToListTest: (handle) =>
          !handle.endsWith(".house.gov") && !handle.endsWith(".senate.gov"),
      },
    ],
  },
];

async function runBots() {
  // Read-only mode, mostly for testing
  const readOnly = process.env.READ_ONLY === "true";

  for (const botConfig of bots) {
    console.log(`Running bot: ${botConfig.name} (${botConfig.handle})`);
    const bot = new GovskyBot(botConfig, readOnly);

    console.log("Logging in...");
    await bot.login();

    console.log("Get relevant users...");
    const users = await getUserForAllDomains(botConfig.domains);

    console.log("Following and/or unfollowing users...");
    await bot.followOrUnfollow(users);

    console.log("Adding and/or removing users from lists...");
    await bot.addOrRemoveFromLists(users);
  }
}

cron.schedule("*/5 * * * *", () => {
  runBots();
});
