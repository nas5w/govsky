type PlcRecord = {
  did: string;
  handle: string;
};

type DataCallback = (data: PlcRecord[]) => void;

function delay(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

export class PlcAgent {
  private requestDelayMs = 500;
  private backoffDelay = 120_000;

  constructor(private latestRecord: Date) {}

  async export(callback: DataCallback) {
    const data = await this.getData();
    if (data) {
      callback(data);
    }
    delay(data ? this.requestDelayMs : this.backoffDelay);
    this.export(callback);
  }

  private async getData(): Promise<PlcRecord[] | null> {
    const res = await fetch(
      `https://plc.directory/export?count=1000&after=${this.latestRecord.toISOString()}`
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

      const akas = rowJson.operation.alsoKnownAs || [];

      for (const handle of akas) {
        if (!handle.endsWith(".bsky.social")) {
          added.push({ did: rowJson.did, handle });
        }
      }
    }
  }
}
