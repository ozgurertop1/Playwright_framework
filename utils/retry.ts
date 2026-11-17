/**
 * Status codes that signal a temporary server / gateway problem
 * (rate limiting, overload, Cloudflare 52x) rather than a product bug.
 */
export const TRANSIENT_STATUSES: ReadonlySet<number> = new Set([
  429, 502, 503, 504, 520, 521, 522, 523, 524,
]);

export interface RetryOptions {
  attempts?: number;
  delayMs?: number;
}

/**
 * Runs `action` and repeats it with linear back-off while `isTransient`
 * says the result was a temporary failure. The final result is returned
 * as-is, so the test still fails clearly if the problem persists.
 */
export async function withRetry<T>(
  action: () => Promise<T>,
  isTransient: (result: T) => boolean,
  { attempts = 3, delayMs = 1_000 }: RetryOptions = {}
): Promise<T> {
  let result = await action();
  for (let attempt = 1; attempt < attempts && isTransient(result); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    result = await action();
  }
  return result;
}
