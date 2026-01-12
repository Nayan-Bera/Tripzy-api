import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';


// Import routes
// import { bookingRoutes, userRoutes } from './routes';
import { config } from './config';
import { adminHotelRoutes, authRoutes, otpRoutes, providerHotelRoutes, roleRoutes } from './routes';
import { role } from './db/schema';
// import propertyRoutes from './routes/property.route';
// import paymentRoutes from './routes/payment.route';
// import reviewRoutes from './routes/review.route';
// import notificationRoutes from './routes/notification.route';
// import identityRoutes from './routes/identity.route';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(
    cors({
        origin: [config.ORIGIN_FRONTEND],
        credentials: true,
    }),
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
// app.use('/api/', createRateLimiter);

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
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/bookings', bookingRoutes);
// app.use('/api/v1/properties', propertyRoutes);
// app.use('/api/v1/payments', paymentRoutes);
// app.use('/api/v1/reviews', reviewRoutes);
// app.use('/api/v1/notifications', notificationRoutes);
// app.use('/api/v1/identity', identityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/admin/hotel', adminHotelRoutes);
app.use('/api/provider', providerHotelRoutes);



// Google OAuth routes
// app.get(
//     '/auth/google',
//     passport.authenticate('google', {
//         session: false,
//         scope: ['profile', 'email'],
//     }),
// );

// app.get(
//     '/auth/google/callback',
//     passport.authenticate('google', {
//         session: false,
//         failureRedirect: `${config.ORIGIN_FRONTEND}/auth/login`,
//     }),
//     function (req: any, res: any) {
//         const {
//             email_verified,
//             phone_verified,
//             role,
//             access_token,
//             refresh_token,
//         } = req.user;

//         setTokensCookies(
//             res,
//             email_verified,
//             phone_verified,
//             role,
//             access_token,
//             refresh_token,
//         );

//         if (req.query.jsonResponse) {
//             responseData(
//                 res,
//                 email_verified,
//                 phone_verified,
//                 role,
//                 access_token,
//                 refresh_token,
//             );
//         } else {
//             res.redirect(`${config.ORIGIN_FRONTEND}/dashboard/home`);
//         }
//     },
// );

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});

// Error handling

export default app;
