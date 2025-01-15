# @govsky/database

This project contains the Prisma config for the Govsky project. To update the schema, follow the standard Prisma process:

1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev` to generate a migration file and apply it to your local DB
3. Run `npx prisma generate` to re-generate the Prisma client.
