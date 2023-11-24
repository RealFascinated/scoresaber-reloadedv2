export class FetchQueue {
  private queue: string[];
  private rateLimitReset: number;

  constructor() {
    this.queue = [];
    this.rateLimitReset = Date.now();
  }

  /**
   * Fetches the given URL and handles rate limiting, re-requesting if the rate limit is exceeded.
   *
   * @param url - The URL to fetch.
   * @returns The response.
   */
  public async fetch(url: string, options?: any): Promise<Response> {
    const now = Date.now();

    if (now < this.rateLimitReset) {
      this.queue.push(url);
      await new Promise<void>((resolve) =>
        setTimeout(resolve, this.rateLimitReset - now),
      );
    }

    const response = await fetch(url, {
      ...options,
      next: {
        revalidate: 300, // 5 minutes
      },
    });
    if (response.status === 429) {
      const hasRetryAfterHeader = response.headers.has("retry-after");
      let retryAfter = hasRetryAfterHeader
        ? Number(response.headers.get("retry-after"))
        : Number(
            new Date(
              response.headers.get("X-Rate-Limit-Reset") as string,
            ).getTime() / 1000,
          ) * 1000;

      // Check if we couldn't get the reset time from the headers.
      // Default to 3 seconds
      if (!retryAfter) {
        retryAfter = 3000;
      }

      this.queue.push(url);
      await new Promise<void>((resolve) => setTimeout(resolve, retryAfter));
      return this.fetch(this.queue.shift() as string);
    }

    if (response.headers.has("x-ratelimit-remaining")) {
      const remaining = Number(response.headers.get("x-ratelimit-remaining"));

      if (remaining === 0) {
        const reset = Number(response.headers.get("x-ratelimit-reset")) * 1000;
        this.queue.push(url);
        await new Promise<void>((resolve) => setTimeout(resolve, reset - now));
        return this.fetch(this.queue.shift() as string);
      }
    }

    if (this.queue.length > 0) {
      const nextUrl = this.queue.shift();
      return this.fetch(nextUrl as string);
    }

    return response;
  }
}
