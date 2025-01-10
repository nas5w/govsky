import { PrismaClient, User } from "@prisma/client";
import { PlcAgent, PlcRecord } from "./plcAgent";

const prisma = new PrismaClient();

const LATEST_RECORD_SETTING_KEY = "latestRecord";

async function addHandles(records: PlcRecord[], latestRecord: Date) {
  if (records.length) {
    await prisma.user.createMany({
      data: records.map((record) => {
        const handleParts = record.handle.split(".");
        const handlePart1 = handleParts.pop() || "";
        const handlePart2 = handleParts.pop() || "";
        const handlePart3 = handleParts.pop() || "";
        return {
          ...record,
          handlePart1,
          handlePart2,
          handlePart3,
        };
      }),
    });
  }
  await prisma.setting.upsert({
    where: { key: LATEST_RECORD_SETTING_KEY },
    update: {
      value: latestRecord.toISOString(),
    },
    create: {
      key: LATEST_RECORD_SETTING_KEY,
      value: latestRecord.toISOString(),
    },
  });
}

async function main() {
  const latestRecord = await prisma.setting.findFirst({
    where: { key: LATEST_RECORD_SETTING_KEY },
  });

  const plcAgent = new PlcAgent(new Date(latestRecord?.value || 0));

  plcAgent.startExport((data) => {
    console.log(data.latestRecord, data.records.length);
    addHandles(data.records, data.latestRecord);
  });
}

main();
