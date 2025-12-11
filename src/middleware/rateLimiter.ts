// src/middleware/rateLimiters.ts
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";
import logger from "../utils/logger";
import { config } from "../config";

let redisClient: Redis | null = null;
let redisStore: any = null;

// If Redis URL exists, set up Redis store
if (config.redisUrl) {
  try {
    redisClient = new Redis(config.redisUrl);

    redisClient.on("error", (err) => {
      logger.error("Redis error:", err);
    });

    redisStore = new (RedisStore as any)({
      sendCommand: (...args: any[]) => (redisClient as any).call(...args),
    });
  } catch (err) {
    logger.error("Failed to connect Redis for rate limiting:", err);
  }
} else {
  logger.warn("REDIS_URL not provided → Using in-memory rate limiter");
}

/**
 * Create a per-route rate limiter
 *
 * @param windowMs - time window (ms)
 * @param max - number of allowed requests
 */
export const createRateLimiter = (windowMs: number, max: number) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: "error",
      message: "Too many requests, please try again later.",
    },
    ...(redisStore ? { store: redisStore } : {}),
  });

// Export redisClient optionally (if you need it elsewhere)
export { redisClient };
