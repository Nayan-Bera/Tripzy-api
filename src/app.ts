import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import config from './config';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import rateLimiter from './middleware/rateLimiter';

// Import routes
import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
import propertyRoutes from './routes/property.route';
import bookingRoutes from './routes/booking.route';
import paymentRoutes from './routes/payment.route';
import reviewRoutes from './routes/review.route';
import notificationRoutes from './routes/notification.route';
import identityRoutes from './routes/identity.route';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: [config.frontendUrl, config.adminUrl, config.hotelUrl],
    credentials: true,
}));

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

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/identity', identityRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
    });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});

export default app; 