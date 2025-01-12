#!/usr/bin/bash

# This script starts both the govsky API and backfill services because
# they currently run on the same box.

cd projects/api && rushx start &
cd projects/plc-backfill && rushx start
