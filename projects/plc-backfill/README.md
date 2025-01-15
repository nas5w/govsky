# @govsky/plc-backfill

This project populates the Govsky database with new user handles using https://plc.directory. It additionally validates the handles using the Bluesky API. Both of these actions are performed at an interval as specified in `index.ts`.

To run the backfill and validation process, run `rushx start` is this directory.
