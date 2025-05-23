import winston from 'winston';
import config from '../config';

const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: config.logFilePath,
            level: 'error',
        }),
        new winston.transports.File({
            filename: config.logFilePath.replace('.log', '-combined.log'),
        }),
    ],
});

if (config.nodeEnv !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

export default logger; 