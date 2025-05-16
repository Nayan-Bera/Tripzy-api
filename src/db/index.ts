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
import { userRelations } from './schema/user';
import { propertiesRelations } from './schema/properties';
import { roomsRelations } from './schema/rooms';
import { roomImagesRelations } from './schema/roomsImages';
import { roomAvailabilityRelations } from './schema/roomavailable';
import { couponsRelations } from './schema/coupons';
import { favoritesRelations } from './schema/favourites';
import { notificationsRelations } from './schema/notifications';
import { userDetailsRelations } from './schema/userDetails';
import { propertyImagesRelations } from './schema/PropertiesImages';
import { paymentsRelations } from './schema/payments';
import { reviewsRelations } from './schema/review';
import { userCouponsRelations } from './schema/userCoupons';
import { digitalVerificationRelations } from './schema/digitelverification';

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
    userRelations,
    propertiesRelations,
    roomsRelations,
    roomImagesRelations,
    roomAvailabilityRelations,
    couponsRelations,
    favoritesRelations,
    notificationsRelations,
    propertyImagesRelations,
    paymentsRelations,
    reviewsRelations,
    userCouponsRelations,
    userDetailsRelations,
    digitalVerificationRelations,
} as const;

export const sql = postgres(process.env.PG_DB_URL || '', { max: 1 });
const db = drizzle(sql, { schema, logger: false });
export default db;
