import dotenv from "dotenv";
import { GovskyBot } from "./govsky-bot";
import { getUserForAllDomains } from "./helpers";
import { botConfigs } from "./configs";

const BOT_INTERVAL = 5 * 60_000;

dotenv.config();

async function runBots() {
  // Read-only mode, mostly for testing
  const readOnly = process.env.READ_ONLY === "true";

  for (const botConfig of botConfigs) {
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
