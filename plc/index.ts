import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const latestRecord = await prisma.setting.findFirst({
    where: { value: "latestRecord" },
  });

  console.log(latestRecord);
}

main();
