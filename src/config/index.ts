import dotenv from 'dotenv';
dotenv.config();

export const config = {
    ORIGIN_FRONTEND: process.env.ORIGIN_FRONTEND || '',
    ORIGIN_ADMIN: process.env.ORIGIN_ADMIN || '',
    ORIGIN_FRONTEND_WWW: process.env.ORIGIN_FRONTEND_WWW || '',
    DB_URL: process.env.DB_URL || '',
    SALT: process.env.SALT || '',
    ACCESS_SECRET: process.env.ACCESS_SECRET || '',
    REFRESH_SECRET: process.env.REFRESH_SECRET || '',
    PORT: process.env.PORT || 8000,
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT || '',
    SMTP_SRC: process.env.SMTP_SRC || '',
    SMTP_MAIL: process.env.SMTP_MAIL || '',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
    PG_DB_URL: process.env.PG_DB_URL || '',
    RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
    RAZORPAY_API_SECRET: process.env.RAZORPAY_API_SECRET,
   
}; 