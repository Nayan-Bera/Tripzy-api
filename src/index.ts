import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import config from './config';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';
import db from './db';

import './services/googleStrategy';
import setTokensCookies from './Services/setTokencookies';
import responseData from './Services/responseData';

// Import routes
import { bookingRoutes, userRoutes } from './routes';
import propertyRoutes from './routes/property.route';
import paymentRoutes from './routes/payment.route';
import reviewRoutes from './routes/review.route';
import notificationRoutes from './routes/notification.route';
import identityRoutes from './routes/identity.route';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(
    cors({
        origin: [config.frontendUrl, config.adminUrl, config.hotelUrl],
        credentials: true,
    })
);
app.use(passport.initialize());
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
app.use('/api/', rateLimiter);

// Test routes
app.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        message: 'Welcome to FindYourHotel API',
    });
});

app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'success',
        message: 'Server is running',
        environment: config.nodeEnv,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/identity', identityRoutes);

// Google OAuth routes
app.get(
    '/auth/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
    })
);

app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${config.frontendUrl}/auth/login`,
    }),
    function (req: any, res: any) {
        const {
            email_verified,
            phone_verified,
            role,
            access_token,
            refresh_token,
        } = req.user;

        setTokensCookies(
            res,
            email_verified,
            phone_verified,
            role,
            access_token,
            refresh_token
        );

        if (req.query.jsonResponse) {
            responseData(
                res,
                email_verified,
                phone_verified,
                role,
                access_token,
                refresh_token
            );
        } else {
            res.redirect(`${config.frontendUrl}/dashboard/home`);
        }
    }
);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await db.query.user.findFirst();
        logger.info('Database connection successful');

        app.listen(config.port, () => {
            logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    process.exit(0);
});

startServer();
