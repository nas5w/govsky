import { ApiUser } from "@govsky/api/types";
import { BotConfig } from "./types";

export async function getUserForAllDomains(domains: BotConfig["domains"]) {
  const requests = domains.map(
    (domain) =>
      fetch(`${process.env.API_BASE_URL}/api/${domain}`).then((res) =>
        res.json()
      ) as Promise<{ data: ApiUser[] }>
  );
  const responses = await Promise.all(requests);
  return responses.reduce((acc, el) => {
    return [...acc, ...el.data];
  }, [] as ApiUser[]);
}
