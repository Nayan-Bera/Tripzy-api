// src/server.ts
import logger from './utils/logger';
import db from './db';
import { sql } from 'drizzle-orm';
import app from './app';
import { config } from './config';

const startServer = async () => {
  try {
    // Try connecting to the DB
    logger.info('Attempting database connection...');
    await db.execute(sql`SELECT 1`);
    logger.info('✅ Database connection successful');

    // Start server
    const port = Number(config.PORT) || 8000;

    app.listen(port, () => {
      logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${port}`);
    });
  } catch (error: any) {
    logger.error('❌ DATABASE CONNECTION FAILED!');
    logger.error('Error Code:', error?.code || 'UNKNOWN');
    logger.error('Message:', error?.message || error);

    // Important: exit ONLY because DB failed — not because server crashed
    process.exit(1);
  }
};

// Handle uncaught synchronous errors
process.on('uncaughtException', (err: any) => {
  logger.error('💥 UNCAUGHT EXCEPTION — server crashed');
  logger.error('Name:', err?.name);
  logger.error('Message:', err?.message);
  logger.error('Stack:', err?.stack);
  process.exit(1);
});

// Handle rejected promises not caught
process.on('unhandledRejection', (err: any) => {
  logger.error('💥 UNHANDLED REJECTION — server crashed');
  logger.error('Name:', err?.name);
  logger.error('Message:', err?.message);
  process.exit(1);
});

// Graceful shutdown (e.g., Render, Vercel, Docker)
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received — shutting down gracefully');
  process.exit(0);
});

startServer();
