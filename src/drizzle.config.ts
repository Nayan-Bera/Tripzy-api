import { defineConfig } from 'drizzle-kit';
export default defineConfig({
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