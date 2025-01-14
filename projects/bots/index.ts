import { config } from "@govsky/config";
import { BotConfig } from "./types";
import { GovskyBot } from "./govsky-bot";

const bots: BotConfig[] = [
  {
    name: "Govsky US",
    handle: process.env.GOVSKY_US_HANDLE || "",
    password: process.env.GOVSKY_US_PW || "",
    domains: config.us.domains,
    lists: [],
  },
];

async function runBots() {
  for (const botConfig of bots) {
    console.log(`Running bot: ${botConfig.name} (${botConfig.handle})`);
    const bot = new GovskyBot(botConfig);
    console.log("Logging in...");
    await bot.login();
    console.log("Getting own following...");
    const ownFollowing = await bot.getOwnFollowing();
  }
}

// Execute this on cron eventually
runBots();
