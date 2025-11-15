import Redis from "ioredis";
import { logger } from "../utils/logger";

const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redis = new Redis(url);

redis.on("connect", () => logger.info("Redis connecting..."));
redis.on("ready", () => logger.info("Redis ready"));
redis.on("error", err => logger.error("Redis error", err));

export async function getCache<T>(key: string): Promise<T | null> {
  const v = await redis.get(key);
  if (!v) return null;
  return JSON.parse(v) as T;
}

export async function setCache(key: string, value: any, ttl = 30) {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
}
