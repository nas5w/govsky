import { PlcAgent, PlcRecord } from "./plcAgent";
import { GovskyPrismaClient } from "@govsky/database";

const prisma = new GovskyPrismaClient();

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

let backfillIsRunning = false;

export async function backfill() {
  if (backfillIsRunning) {
    console.log("Backfill already running");
    return;
  }

  const latestRecord = await prisma.setting.findFirst({
    where: { key: LATEST_RECORD_SETTING_KEY },
  });

  const plcAgent = new PlcAgent(new Date(latestRecord?.value || 0));

  plcAgent.startExport(
    (data) => {
      console.log(data.latestRecord, data.records.length);
      addHandles(data.records, data.latestRecord);
    },
    () => {
      backfillIsRunning = false;
    }
  );
}

// Disconnect from DB on shutdown
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
  process.on(signal, async () => {
    console.log("Disconnecting from DB...");
    await prisma.$disconnect();
    console.log("Exiting proess...");
    process.exit();
  })
);
