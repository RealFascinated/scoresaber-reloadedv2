export class FetchQueue {
  private _queue: string[];
  private _rateLimitReset: number;

  constructor() {
    this._queue = [];
    this._rateLimitReset = Date.now();
  }

  /**
   * Fetches the given url, and handles rate limiting
   * re-requesting if the rate limit is exceeded.
   *
   * @param url the url to fetch
   * @returns the response
   */
  public async fetch(url: string): Promise<any> {
    const now = Date.now();
    if (now < this._rateLimitReset) {
      this._queue.push(url);
      await new Promise<void>((resolve) =>
        setTimeout(resolve, this._rateLimitReset - now),
      );
    }

    const response = await fetch(url, {
      next: {
        revalidate: 3600, // Keep the data for 1 hour, then fetch new data
      },
    });
    if (response.status === 429) {
      const hasRetryAfter = response.headers.has("retry-after");
      let retryAfter =
        Number(
          hasRetryAfter
            ? response.headers.get("retry-after")
            : new Date(
                response.headers.get("X-Rate-Limit-Reset") as string,
              ).getTime() / 1000,
        ) * 1000;
      if (!retryAfter) {
        retryAfter = 3_000; // default to 3 seconds if we can't get the reset time
      }
      this._queue.push(url);
      await new Promise<void>((resolve) => setTimeout(resolve, retryAfter));
      return this.fetch(this._queue.shift() as string);
    }

    if (response.headers.has("x-ratelimit-remaining")) {
      const remaining = Number(response.headers.get("x-ratelimit-remaining"));
      if (remaining === 0) {
        const reset = Number(response.headers.get("x-ratelimit-reset")) * 1000;
        this._queue.push(url);
        await new Promise<void>((resolve) => setTimeout(resolve, reset - now));
        return this.fetch(this._queue.shift() as string);
      }
    }

    if (this._queue.length > 0) {
      const nextUrl = this._queue.shift();
      return this.fetch(nextUrl as string);
    }

    return response;
  }
}
