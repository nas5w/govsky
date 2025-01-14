# Govsky

Welcome to the Govsky project! Here you will find the code that powers Govsky. The aim of making this code available is two-part: (1) transparency about hwo Govsky works and (2) providing working code that others can use to implement part or all of the Govsky offerings.

## What is Govsky?

Govsky provides [Bluesky](https://bsky.app/) bots and lists that track official government accounts on Bluesky. Additionally, Govsky provides a web app to search and visualize government presence.

- [Govsky US Bluesky account](https://bsky.app/profile/govsky.bsky.social)
- [Govsky US .GOV account list](https://bsky.app/profile/govsky.bsky.social/lists/3lf3xwfybxl2j)
- [Govsky web app](https://govsky.pages.dev/)

## What's included in this repo

This codebase is a [Rush.js](https://rushjs.io/) monorepo with the following [node.js](https://nodejs.org/)-based projects:

| Project              | Description                                                                                                                                                   | Location              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| @govsky/api          | A node API server that returns government entity handles, dids, and display names.                                                                            | projects/api          |
| @govsky/bots         | A node project that periodically hits the API and performs various automated actions by Bluesky bot accounts: follow, unfollow, welcome message, add to list. | projects/bots         |
| @govsky/config       | Shared config files used in other projects in the monorepo.                                                                                                   | projects/config       |
| @govsky/database     | Shared database specification for tracking plc.directory changes.                                                                                             | projects/database     |
| @govsky/plc-backfill | Code used to keep up-to-date with plc.directory changes and periodically validate relevant entries.                                                           | projects/plc-backfill |
