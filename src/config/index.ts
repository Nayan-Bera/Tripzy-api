import dotenv from 'dotenv';
dotenv.config();

export const config = {
    PORT: process.env.PORT || 8000,
    ACCESS_SECRET: process.env.ACCESS_SECRET || 'your_jwt_secret',
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SRC: process.env.SMTP_SRC,
    SMTP_MAIL: process.env.SMTP_MAIL,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL
}; 