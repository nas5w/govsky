import { ApiUser } from "@govsky/api/types";
import { config } from "@govsky/config";
import { BotConfig } from "./types";

export const govskyUsBot: BotConfig = {
  name: "Govsky US",
  handle: process.env.GOVSKY_US_HANDLE || "",
  password: process.env.GOVSKY_US_PW || "",
  domains: config.us.domains,
  welcomeMessage: (user: ApiUser) => {
    const name = user.displayName
      ? `${user.displayName} (@${user.handle})`
      : `@${user.handle}`;
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
};
