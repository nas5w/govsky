export type PlcRecord = {
  did: string;
  handle: string;
};

type CallbackPayload = {
  records: PlcRecord[];
  latestRecord: Date;
};

type DataCallback = (data: CallbackPayload) => void;

function delay(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

let knownSpamDomains = new Set<string>([]);

try {
  knownSpamDomains = new Set(
    (process.env.SPAM_DOMAINS || "").toLocaleLowerCase().split(",")
  );
} catch {}

export class PlcAgent {
  private requestDelayMs = 500;
  private backoffDelay = 120_000;
  private limit = 1000;
  private maxHandleLength = 263;
  private currentTimeLag = 5 * 60_000;

  constructor(private latestRecord: Date) {}

  async startExport(callback: DataCallback, doneCallback: () => void) {
    if (Date.now() - this.latestRecord.getTime() < this.currentTimeLag) {
      console.log("Backfill up-to-date. Stopping.");
      doneCallback();
      return;
    }

    const data = await this.getData();

    if (data) {
      callback(data);
    }

    await delay(data ? this.requestDelayMs : this.backoffDelay);

    this.startExport(callback, doneCallback);
  }

  private isValidHandle(handle: string) {
    // Maximum domain is 263 characters. Anything higher is shenanigans.
    if (handle.replace(/\./g, "").length > this.maxHandleLength) {
      return false;
    }
    // Check for invalid domains
    const handleParts = handle.split(".").reverse();
    if (
      !handleParts[1] ||
      handleParts[0].length < 2 ||
      handleParts[1].length < 2
    ) {
      return false;
    }
    // It's very unlikely any legitimate handle part will be over 50 characters
    if (handleParts.some((part) => part.length >= 50)) {
      return false;
    }
    // There are some known, non-gov spam domains
    if (knownSpamDomains.has(handleParts[1])) {
      return false;
    }
    return true;
  }

  private async getData(): Promise<CallbackPayload | null> {
    const res = await fetch(
      `https://plc.directory/export?count=${
        this.limit
      }&after=${this.latestRecord.toISOString()}`
    );

    if (res.status === 429) {
      console.log("rate limited, backing off");
      this.requestDelayMs += 5;
      return null;
    }

    const data = await res.text();
    const rows = data.split("\n");
    const added: PlcRecord[] = [];

    for (const row of rows) {
      const rowJson = JSON.parse(row);

      const recordDate = new Date(rowJson.createdAt);
      if (recordDate.getTime() > this.latestRecord.getTime()) {
        this.latestRecord = recordDate;
      }

      const akas = rowJson.operation.handle
        ? [rowJson.operation.handle]
        : rowJson.operation.alsoKnownAs || [];

      for (const handle of akas) {
        if (!handle.endsWith(".bsky.social")) {
          const shortenedHandle = handle.replace(/^at:\/\//, "");

          // Make sure the handle is reasonable
          if (!this.isValidHandle(shortenedHandle)) {
            continue;
          }

          added.push({
            did: rowJson.did,
            handle: shortenedHandle,
          });
        }
      }
    }

    return { records: added, latestRecord: this.latestRecord };
  }
}
