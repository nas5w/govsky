#!/usr/bin/bash

# This script starts both the govsky API and backfill services because
# they currently run on the same box.

cd ./projects/api && node dist/index.js &
cd ./projects/plc-backfill && node dist/index.js
