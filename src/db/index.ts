import "dotenv/config";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
    bookings,
    contectus,
    documents,
    familyMembers,
    favorites,
    hotels,
    images,
    notifications,
    otps,
    payments,
    payouts,
    properties,
    refreshTokens,
    reviews,
    roomAvailabilities,
    rooms,
    unavailabilities,
    users,
    bookingRooms,
    role,
    hotelUsers,
    rolePermissions,
} from './schema';
import { userRelations } from './schema/user';
import { documentRelations } from './schema/documents';
import { otpRelations } from './schema/emailOtp';
import { familyMemberRelations } from './schema/familymabers';
import { favoriteRelations } from './schema/favorites';
import { hotelRelations } from './schema/hotel';
import { imageRelations } from './schema/image';
import { notificationRelations } from './schema/notifications';
import { paymentRelations } from './schema/payments';
import { payoutRelations } from './schema/payouts';
import { propertyRelations } from './schema/properties';
import { refreshTokenRelations } from './schema/refreshtoken';
import { reviewRelations } from './schema/reviews';
import { roomAvailabilityRelations } from './schema/roomAvailability';
import { roomRelations } from './schema/room';
import { unavailabilityRelations } from './schema/unAvailaibility';
import { bookingRoomRelations } from './schema/bookingRooms';
import { bookingRelations } from './schema/booking';
import { roleRelations } from './schema/role';
import { hotelUserRelations } from './schema/hotelUser';
import permissions, { permissionRelations } from './schema/permission';
import { rolePermissionRelations } from './schema/rolePermission';

const schema = {
    users,
    otps,
    favorites,
    refreshTokens,
    properties,
    contectus,
    hotels,
    images,
    familyMembers,
    documents,
    notifications,
    payouts,
    payments,
    bookings,
    bookingRooms,
    rooms,
    reviews,
    role,
    hotelUsers,
    permissions,
    rolePermissions,
    hotelUserRelations,
    permissionRelations,
    rolePermissionRelations,
    roleRelations,
    roomAvailabilities,
    unavailabilities,
    userRelations,
    documentRelations,
    otpRelations,
    familyMemberRelations,
    favoriteRelations,
    hotelRelations,
    imageRelations,
    notificationRelations,
    paymentRelations,
    payoutRelations,
    propertyRelations,
    refreshTokenRelations,
    reviewRelations,
    roomAvailabilityRelations,
    roomRelations,
    unavailabilityRelations,
    bookingRelations,
    bookingRoomRelations,
} as const;

export const sql = postgres(process.env.PG_DB_URL || '', { max: 1 });
const db = drizzle(sql, { schema, logger: false });
export default db;
