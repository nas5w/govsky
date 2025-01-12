#!/usr/bin/bash

# This script starts both the govsky API and backfill services because
# they currently run on the same box.

cd projects/database && npx prisma generate
cd ../api && rushx start &
cd ../plc-backfill && rushx start
