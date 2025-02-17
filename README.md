# Govsky

Welcome to the Govsky project!

Here you will find the code that powers Govsky. The aim of making this code available is two-part: (1) transparency about how Govsky works and (2) providing working code that others can use to implement part or all of the Govsky offerings.

## What is Govsky?

Govsky provides [Bluesky](https://bsky.app/) bots and lists that track official government accounts on Bluesky. Additionally, Govsky provides a web app to search and visualize government presence.

- [Govsky US Bluesky account](https://bsky.app/profile/us.govsky.org)
- [Govsky US .gov account list](https://bsky.app/profile/us.govsky.org/lists/3lf3xwfybxl2j)
- [Govsky web app](https://govsky.org)

## Contributing to the Govsky accounts

If you're here to suggest new countries or domains, thank you! The best way to get started is to [open an issue in this repo](https://github.com/nas5w/govsky/issues) and we can discuss adding it.

### Contributors

Big thanks to the following folks for making Govsky happen!

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://miguelcorrea.dev"><img src="https://avatars.githubusercontent.com/u/11799597?v=4?s=100" width="100px;" alt="Miguel Correa"/><br /><sub><b>Miguel Correa</b></sub></a><br /><a href="#code-miguelc1221" title="Code">💻</a> <a href="#infra-miguelc1221" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://nick.scialli.me"><img src="https://avatars.githubusercontent.com/u/7538045?v=4?s=100" width="100px;" alt="Nick Scialli"/><br /><sub><b>Nick Scialli</b></sub></a><br /><a href="#code-nas5w" title="Code">💻</a> <a href="#infra-nas5w" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#bug-nas5w" title="Bug reports">🐛</a> <a href="#content-nas5w" title="Content">🖋</a> <a href="#data-nas5w" title="Data">🔣</a> <a href="#financial-nas5w" title="Financial">💵</a> <a href="#maintenance-nas5w" title="Maintenance">🚧</a> <a href="#platform-nas5w" title="Packaging/porting to new platform">📦</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://shuuji3.xyz"><img src="https://avatars.githubusercontent.com/u/1425259?v=4?s=100" width="100px;" alt="TAKAHASHI Shuuji"/><br /><sub><b>TAKAHASHI Shuuji</b></sub></a><br /><a href="#code-shuuji3" title="Code">💻</a> <a href="#ideas-shuuji3" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Sorry"><img src="https://avatars.githubusercontent.com/u/43435134?v=4?s=100" width="100px;" alt="Sorry"/><br /><sub><b>Sorry</b></sub></a><br /><a href="#review-sorry" title="Reviewed Pull Requests">👀</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Bring your own code

If you're just interested in consuming the Govsky API from your own code, that's great! You can hit the following endpoint to get a list of validated Bluesky government handles:

```
https://api.govsky.org/api/[domain-here]
```

For example, if you want to see all `.gov` domains, you can use the following URL: https://api.govsky.org/api/.gov. If the government domain you want is not available, please [open an issue in this repo](https://github.com/nas5w/govsky/issues) and we can get it added.

## What's included in this repo

This codebase is a [Rush.js](https://rushjs.io/) monorepo with the following [node.js](https://nodejs.org/)-based projects:

| Project              | Description                                                                                                                                                   | Location                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| @govsky/api          | A node API server that returns government entity handles, dids, and display names.                                                                            | [projects/api](./projects/api/)                   |
| @govsky/bots         | A node project that periodically hits the API and performs various automated actions by Bluesky bot accounts: follow, unfollow, welcome message, add to list. | [projects/bots](./projects/bots/)                 |
| @govsky/config       | Shared config files used in other projects in the monorepo.                                                                                                   | [projects/config](./projects/config/)             |
| @govsky/database     | Shared database specification for tracking plc.directory changes.                                                                                             | [projects/database](./projects//database/)        |
| @govsky/plc-backfill | Code used to keep up-to-date with plc.directory changes and periodically validate relevant entries.                                                           | [projects/plc-backfill](./projects/plc-backfill/) |
| @govsky/web          | Code for the Govsky web app UI.                                                                                                                               | [projects/web](./projects/web/)                   |

Each project directory has its own README file where you can learn more about the individual project.

## Running Govsky locally

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

Rush has a handy deploy command. You can deploy the backend services using the following command:

```
rush deploy -p @govsky/api
```

Or the web app using this command:

```
rush deploy -p @govsky/web
```

This bundles up all the projects as specified in `common/config/rush/deploy.json` and puts them in the `common/deploy` directory. This directory can then be placed on a server and the individual projects can be run.

## Infrastructure files

There following files are related to how Govsky gets deployed to and run on [fly.io](https://fly.io/):

- `Dockerfile`
- `fly.toml`
- The `scripts` directory

These likely won't be of interest unless you're deploying all or part of the service.
