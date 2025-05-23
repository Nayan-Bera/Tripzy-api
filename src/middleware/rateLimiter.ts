import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import config from '../config';
import logger from '../utils/logger';

const redis = new Redis(config.redisUrl);

redis.on('error', (err) => {
    logger.error('Redis error:', err);
});

const rateLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args: string[]) => redis.call(...args),
    }),
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default rateLimiter; 