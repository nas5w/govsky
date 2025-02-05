import { ApiUser } from "@govsky/api/types";
import { config } from "@govsky/config";
import { BotConfig } from "./types";

const govskyUsBot: BotConfig = {
  name: "Govsky US",
  handle: process.env.GOVSKY_US_HANDLE || "",
  password: process.env.GOVSKY_US_PW || "",
  domains: config.us.domains,
  welcomeMessage: (user: ApiUser) => {
    const name = user.displayName
      ? `${user.displayName} (@${user.handle})`
      : `@${user.handle}`;
    return `${name} is on Bluesky!`;
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

const govskyUkBot: BotConfig = {
  name: "Govsky UK",
  handle: process.env.GOVSKY_UK_HANDLE || "",
  password: process.env.GOVSKY_UK_PW || "",
  domains: config.uk.domains,
  welcomeMessage: (user: ApiUser) => {
    const name = user.displayName
      ? `${user.displayName} (@${user.handle})`
      : `@${user.handle}`;
    return `${name} is on Bluesky!`;
  },
  lists: [
    {
      description: "All gov",
      uri: "at://did:plc:gnfxktinssm6uvy27ngysmlo/app.bsky.graph.list/3lfwzdtwuqd2a",
      addHandleToListTest: () => true,
    },
  ],
};

const govskyEuBot: BotConfig = {
  name: "Govsky EU",
  handle: process.env.GOVSKY_EU_HANDLE || "",
  password: process.env.GOVSKY_EU_PW || "",
  domains: config.eu.domains,
  welcomeMessage: (user: ApiUser) => {
    const name = user.displayName
      ? `${user.displayName} (@${user.handle})`
      : `@${user.handle}`;
    return `${name} is on Bluesky!`;
  },
  lists: [
    {
      description: "All Europa",
      uri: "at://did:plc:6lgqu6gbqyexectg4dahovbx/app.bsky.graph.list/3lgtsjofumg2j",
      addHandleToListTest: () => true,
    },
  ],
};

const govskyIntBot: BotConfig = {
  name: "Govsky Int",
  handle: process.env.GOVSKY_INT_HANDLE || "",
  password: process.env.GOVSKY_INT_PW || "",
  domains: config.int.domains,
  welcomeMessage: (user: ApiUser) => {
    const name = user.displayName
      ? `${user.displayName} (@${user.handle})`
      : `@${user.handle}`;
    return `${name} is on Bluesky!`;
  },
  lists: [
    {
      description: "All Int",
      uri: "at://did:plc:ufb4svenfc4vfm7udj34tpcu/app.bsky.graph.list/3lhh5zvnv432k",
      addHandleToListTest: () => true,
    },
  ],
};

export const botConfigs = [govskyUsBot, govskyUkBot, govskyEuBot, govskyIntBot];
