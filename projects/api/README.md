# @govsky/api

The Govsky API is a node server using Fastify. It pulls from the PLC database that gets continuously updated by the `@govsky/plc-backfill` project.

## Running the API locally

See the repo's main README file for overall repo setup and build instructions. Once those are complete, you can run the following command to run the API:

```
rushx start
```

You can then view the API responses at http://localhost:3000/api/.gov (assuming you stuck with the default port 3000).
