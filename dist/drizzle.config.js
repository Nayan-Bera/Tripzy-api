"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    dialect: 'postgresql',
    schema: './src/db/schema/index.ts',
    dbCredentials: {
        url: process.env.PG_DB_URL || '',
    },
    migrations: {
        prefix: 'supabase',
    },
    out: './src/db/migrations',
});
