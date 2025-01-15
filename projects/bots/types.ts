import { ApiUser } from "@govsky/api/types.js";
import { GovskyConfig } from "@govsky/config";

export type BotConfig = {
  name: string;
  handle: string;
  password: string;
  domains: GovskyConfig[keyof GovskyConfig]["domains"];
  welcomeMessage: (user: ApiUser) => string;
  lists?: {
    description: string;
    uri: string;
    addHandleToListTest: (handle: string) => boolean;
  }[];
};
