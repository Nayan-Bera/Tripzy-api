import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define configuration schema
const configSchema = z.object({
    // Server
    port: z.string().transform(Number),
    nodeEnv: z.enum(['development', 'production', 'test']),
    apiUrl: z.string().url(),
    corsOrigin: z.string().url(),

    // Database
    databaseUrl: z.string().url(),

    // JWT
    jwtSecret: z.string().min(32),
    jwtExpiresIn: z.string(),
    jwtRefreshSecret: z.string().min(32),
    jwtRefreshExpiresIn: z.string(),

    // Stripe
    stripeSecretKey: z.string().startsWith('sk_'),
    stripeWebhookSecret: z.string().startsWith('whsec_'),
    stripePublishableKey: z.string().startsWith('pk_'),

    // Cloudinary
    cloudinaryCloudName: z.string(),
    cloudinaryApiKey: z.string(),
    cloudinaryApiSecret: z.string(),

    // Email
    smtpHost: z.string(),
    smtpPort: z.string().transform(Number),
    smtpUser: z.string().email(),
    smtpPass: z.string(),

    // Redis
    redisUrl: z.string().url(),

    // Google OAuth
    googleClientId: z.string(),
    googleClientSecret: z.string(),

    // Frontend URLs
    frontendUrl: z.string().url(),
    adminUrl: z.string().url(),
    hotelUrl: z.string().url(),

    // Rate Limiting
    rateLimitWindowMs: z.string().transform(Number),
    rateLimitMaxRequests: z.string().transform(Number),

    // Logging
    logLevel: z.enum(['debug', 'info', 'warn', 'error']),
    logFilePath: z.string(),
});

// Create configuration object
const config = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    apiUrl: process.env.API_URL,
    corsOrigin: process.env.CORS_ORIGIN,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    redisUrl: process.env.REDIS_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
    adminUrl: process.env.ADMIN_URL,
    hotelUrl: process.env.HOTEL_URL,
    rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
    rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS,
    logLevel: process.env.LOG_LEVEL,
    logFilePath: process.env.LOG_FILE_PATH,
};

// Validate configuration
const validatedConfig = configSchema.parse(config);

export default validatedConfig; 