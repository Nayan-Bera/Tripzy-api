"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.createRateLimiter = void 0;
// src/middleware/rateLimiters.ts
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("../utils/logger"));
const config_1 = require("../config");
let redisClient = null;
exports.redisClient = redisClient;
let redisStore = null;
// If Redis URL exists, set up Redis store
if (config_1.config.redisUrl) {
    try {
        exports.redisClient = redisClient = new ioredis_1.default(config_1.config.redisUrl);
        redisClient.on("error", (err) => {
            logger_1.default.error("Redis error:", err);
        });
        redisStore = new rate_limit_redis_1.default({
            sendCommand: (...args) => redisClient.call(...args),
        });
    }
    catch (err) {
        logger_1.default.error("Failed to connect Redis for rate limiting:", err);
    }
}
else {
    logger_1.default.warn("REDIS_URL not provided → Using in-memory rate limiter");
}
/**
 * Create a per-route rate limiter
 *
 * @param windowMs - time window (ms)
 * @param max - number of allowed requests
 */
const createRateLimiter = (windowMs, max) => (0, express_rate_limit_1.default)(Object.assign({ windowMs,
    max, standardHeaders: true, legacyHeaders: false, message: {
        status: "error",
        message: "Too many requests, please try again later.",
    } }, (redisStore ? { store: redisStore } : {})));
exports.createRateLimiter = createRateLimiter;
