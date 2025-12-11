"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
require("./services/googleStrategy");
const responseData_1 = __importDefault(require("./Services/responseData"));
const setTokencookies_1 = __importDefault(require("./Services/setTokencookies"));
// Import routes
// import { bookingRoutes, userRoutes } from './routes';
const config_1 = require("./config");
// import propertyRoutes from './routes/property.route';
// import paymentRoutes from './routes/payment.route';
// import reviewRoutes from './routes/review.route';
// import notificationRoutes from './routes/notification.route';
// import identityRoutes from './routes/identity.route';
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [config_1.config.ORIGIN_FRONTEND],
    credentials: true,
}));
app.use(passport_1.default.initialize());
app.use((0, cookie_parser_1.default)());
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Compression
app.use((0, compression_1.default)());
// Logging
if (config_1.config.nodeEnv === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Rate limiting
// app.use('/api/', createRateLimiter);
// Test routes
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Welcome to FindYourHotel API',
    });
});
app.get('/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Server is running',
        environment: config_1.config.nodeEnv,
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
// Google OAuth routes
app.get('/auth/google', passport_1.default.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
}));
app.get('/auth/google/callback', passport_1.default.authenticate('google', {
    session: false,
    failureRedirect: `${config_1.config.ORIGIN_FRONTEND}/auth/login`,
}), function (req, res) {
    const { email_verified, phone_verified, role, access_token, refresh_token, } = req.user;
    (0, setTokencookies_1.default)(res, email_verified, phone_verified, role, access_token, refresh_token);
    if (req.query.jsonResponse) {
        (0, responseData_1.default)(res, email_verified, phone_verified, role, access_token, refresh_token);
    }
    else {
        res.redirect(`${config_1.config.ORIGIN_FRONTEND}/dashboard/home`);
    }
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});
// Error handling
exports.default = app;
