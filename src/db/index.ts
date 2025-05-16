import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
    bookings,
    digitalVerification,
    favorites,
    notifications,
    offers,
    payments,
    properties,
    propertyImages,
    reviews,
    roomAvailability,
    roomImages,
    rooms,
    user,
    userCoupons,
    userdetails,
} from './schema';

const schema = {
    user,
    offers,
    payments,
    properties,
    userdetails,
    reviews,
    bookings,
    propertyImages,
    favorites,
    userCoupons,
    notifications,
    rooms,
    roomImages,
    roomAvailability,
    digitalVerification,
    
} as const;

export const sql = postgres(process.env.PG_DB_URL || '', { max: 1 });
const db = drizzle(sql, { schema, logger: false });
export default db;
