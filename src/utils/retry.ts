import pRetry from "p-retry";

export function withRetry<T>(fn: () => Promise<T>) {
  return pRetry(fn, {
    retries: 2,
    onFailedAttempt: (err: any) => {
      console.error("Retry attempt failed:", err.message);
    }
  });
}
