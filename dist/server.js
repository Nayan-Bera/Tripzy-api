"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
const db_1 = __importDefault(require("./db"));
const drizzle_orm_1 = require("drizzle-orm");
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test database connection
        yield db_1.default.execute((0, drizzle_orm_1.sql) `SELECT 1`);
        logger_1.default.info('Database connection successful');
        // Start server
        app_1.default.listen(config_1.config.PORT, () => {
            logger_1.default.info(`Server running in ${config_1.config.nodeEnv} mode on port ${config_1.config.PORT}`);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger_1.default.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger_1.default.error(err.name, err.message);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger_1.default.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger_1.default.error(err && err.name, err && err.message);
    process.exit(1);
});
// Handle SIGTERM
process.on('SIGTERM', () => {
    logger_1.default.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    process.exit(0);
});
startServer();
