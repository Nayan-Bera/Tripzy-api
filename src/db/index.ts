import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user } from './schema';

const schema = {
    user,
} as const;

export const sql = postgres(process.env.PG_DB_URL || '', { max: 1 });
const db = drizzle(sql, { schema, logger: false });
export default db;
