// FIX: Require instead of import to avoid Jest ESM issues
const pRetry = require("p-retry");

export function withRetry<T>(fn: () => Promise<T>) {
  return pRetry(fn, {
    retries: 3,
    minTimeout: 200,
  });
}
