/*
Simply in-memory caching. This won't scale past the current simplistic use cases.
Even so, it may be a good idea to switch to something like redis.
*/
export class Cache {
  private cache: Record<string, { expires: Date; data: any }> = {};

  set(key: string, value: any, expiry: number) {
    console.log(`Setting cache: ${key}`);
    this.cache[key] = { expires: new Date(Date.now() + expiry), data: value };
  }

  get(key: string) {
    this.deleteIfExpired(key);
    const data = this.cache[key]?.data;
    if (data) {
      console.log(`Cache hit: ${key}`);
    } else {
      console.log(`Cache miss: ${key}`);
    }
    return data;
  }

  private deleteIfExpired(key: string) {
    const cacheData = this.cache[key];
    if (cacheData === undefined) return;
    if (cacheData.expires.getTime() < Date.now()) {
      delete this.cache[key];
    }
  }
}
