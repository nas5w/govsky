# @govsky/bots

The `@govsky/bots` project is responsible for following, unfollowing, listing, delisting, and sending welcome messages for government accounts.

## Defining a bot

To define a bot, create a bot config object in `configs.ts`. The following example is the config for the Govsky US bot, which has two lists:

```ts
export const govskyUsBot: BotConfig = {
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
};
```

A few important notes:

- The `password` field should be an app password generated through the Bluesky settings UI.
- The `addHandleToListTest` function takes in the account's handle and returns a boolean&mdash;whether or not to include that user in a list.
- The list `description` field just helps with code readability and console output and isn't otherwise used.

## Running the project

Once your bot is configured, and after you follow all the general repo setup steps in the main README file, you can run the project using the following command:

```
rushx build
```

The bot will check for new accounts every 5 minutes.
