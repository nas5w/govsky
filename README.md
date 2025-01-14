# Govsky

Welcome to the Govsky project!

Here you will find the code that powers Govsky. The aim of making this code available is two-part: (1) transparency about hwo Govsky works and (2) providing working code that others can use to implement part or all of the Govsky offerings.

## What is Govsky?

Govsky provides [Bluesky](https://bsky.app/) bots and lists that track official government accounts on Bluesky. Additionally, Govsky provides a web app to search and visualize government presence.

- [Govsky US Bluesky account](https://bsky.app/profile/govsky.bsky.social)
- [Govsky US .GOV account list](https://bsky.app/profile/govsky.bsky.social/lists/3lf3xwfybxl2j)
- [Govsky web app](https://govsky.pages.dev/)

## What's included in this repo

This codebase is a [Rush.js](https://rushjs.io/) monorepo with the following [node.js](https://nodejs.org/)-based projects:

| Project              | Description                                                                                                                                                   | Location                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| @govsky/api          | A node API server that returns government entity handles, dids, and display names.                                                                            | [projects/api](./projects/api/)                   |
| @govsky/bots         | A node project that periodically hits the API and performs various automated actions by Bluesky bot accounts: follow, unfollow, welcome message, add to list. | [projects/bots](./projects/bots/)                 |
| @govsky/config       | Shared config files used in other projects in the monorepo.                                                                                                   | [projects/config](./projects/config/)             |
| @govsky/database     | Shared database specification for tracking plc.directory changes.                                                                                             | [projects/database](./projects//database/)        |
| @govsky/plc-backfill | Code used to keep up-to-date with plc.directory changes and periodically validate relevant entries.                                                           | [projects/plc-backfill](./projects/plc-backfill/) |

## Running locally

All of the projects in the monorepo require node and rush to be installed. All of the projects except `@govsky/bots` require you to have a database up-and-running.

### Install node and rush

To run the project locally, you'll need to make sure you have [node.js](https://nodejs.org/) installed. Additionally, you'll want the Rush.js CLI, which can be installed globally with node's package manager:

```sh
$ npm install -g @microsoft/rush@5.148.0
```

Assuming this worked, you should be able to run/see the following

```
$ rush --version
Rush Multi-Project Build Tool 5.148.0
```

### Run a postgres database locally

**Note:** this step is not required if you're just planning on running the `@govsky/bots` project.

For convenience, a `docker-compose.yml` has been included in the root level of this project, which will run a Dockerized postgres database locally. To use this, you'll need to have [Docker installed first](https://docs.docker.com/engine/).

Assuming docker is installed, you should be able to run the following command to start a local database:

```
docker-compose up
```

### Installing project dependencies

Run the following rush command anywhere inside the monorepo to install dependencies:

```
rush update
```

### Updating environment variables

With the exception of the `@govsky/config` project, each project has a `.env-example` file that will need to be copied to `.env` in the same directory.

The variables in this file will (probably) need to be updated with your own settings. For example, you may need to add the correct connection strings for your database or the correct handle/password for your Bluesky account(s).

### Building the projects

You can build all the projects using the following command:

```
rush build
```

Rush also has some flags for the `build` command to on build a project and some of its dependencies. You can [read up on those flags here](https://rushjs.io/pages/commands/rush_build/).

### Running individual projects

Each of the project, with the exception of `@govsky/config`, can be run with the following command in the project's directory:

```
rushx start
```

Note that this command is just an alias for running `node dist/index.js`.

## Deploying

Rush has a handy deploy command:

```
rush deploy
```

This bundles up all the projects as specified in `common/config/rush/deploy.json` and puts them in the `common/deploy` directory. This directory can then be placed on a server and the individual projects can be run.

## Infrastructure files

There following files are related to how Govsky gets deployed to and run on [fly.io](https://fly.io/):

- `Dockerfile`
- `fly.toml`
- The `scripts` directory

These likely won't be of interest unless you're deploying all or part of the service.
