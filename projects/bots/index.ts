import dotenv from "dotenv";
import { BotConfig } from "./types.js";
import { GovskyBot } from "./govsky-bot.js";
import { getUserForAllDomains } from "./helpers.js";
import { govskyUsBot } from "./configs.js";

const BOT_INTERVAL = 5 * 60_000;

dotenv.config();

console.log(process.env);

const bots: BotConfig[] = [govskyUsBot];

async function runBots() {
  // Read-only mode, mostly for testing
  const readOnly = process.env.READ_ONLY === "true";

  for (const botConfig of bots) {
    try {
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
    } catch (e) {
      console.error("Error running bot!", e);
    }
  }
}

setInterval(() => {
  runBots();
}, BOT_INTERVAL);

runBots();
