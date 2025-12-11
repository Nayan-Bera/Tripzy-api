"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const schema_1 = require("./schema");
const user_1 = require("./schema/user");
const documents_1 = require("./schema/documents");
const emailOtp_1 = require("./schema/emailOtp");
const familymabers_1 = require("./schema/familymabers");
const favorites_1 = require("./schema/favorites");
const hotel_1 = require("./schema/hotel");
const image_1 = require("./schema/image");
const notifications_1 = require("./schema/notifications");
const payments_1 = require("./schema/payments");
const payouts_1 = require("./schema/payouts");
const properties_1 = require("./schema/properties");
const refreshtoken_1 = require("./schema/refreshtoken");
const reviews_1 = require("./schema/reviews");
const roomAvailability_1 = require("./schema/roomAvailability");
const room_1 = require("./schema/room");
const unAvailaibility_1 = require("./schema/unAvailaibility");
const bookingRooms_1 = require("./schema/bookingRooms");
const booking_1 = require("./schema/booking");
const schema = {
    users: schema_1.users,
    otps: schema_1.otps,
    favorites: schema_1.favorites,
    refreshTokens: schema_1.refreshTokens,
    properties: schema_1.properties,
    contectus: schema_1.contectus,
    hotels: schema_1.hotels,
    images: schema_1.images,
    familyMembers: schema_1.familyMembers,
    documents: schema_1.documents,
    notifications: schema_1.notifications,
    payouts: schema_1.payouts,
    payments: schema_1.payments,
    bookings: schema_1.bookings,
    bookingRooms: schema_1.bookingRooms,
    rooms: schema_1.rooms,
    reviews: schema_1.reviews,
    roomAvailabilities: schema_1.roomAvailabilities,
    unavailabilities: schema_1.unavailabilities,
    userRelations: user_1.userRelations,
    documentRelations: documents_1.documentRelations,
    otpRelations: emailOtp_1.otpRelations,
    familyMemberRelations: familymabers_1.familyMemberRelations,
    favoriteRelations: favorites_1.favoriteRelations,
    hotelRelations: hotel_1.hotelRelations,
    imageRelations: image_1.imageRelations,
    notificationRelations: notifications_1.notificationRelations,
    paymentRelations: payments_1.paymentRelations,
    payoutRelations: payouts_1.payoutRelations,
    propertyRelations: properties_1.propertyRelations,
    refreshTokenRelations: refreshtoken_1.refreshTokenRelations,
    reviewRelations: reviews_1.reviewRelations,
    roomAvailabilityRelations: roomAvailability_1.roomAvailabilityRelations,
    roomRelations: room_1.roomRelations,
    unavailabilityRelations: unAvailaibility_1.unavailabilityRelations,
    bookingRelations: booking_1.bookingRelations,
    bookingRoomRelations: bookingRooms_1.bookingRoomRelations
};
exports.sql = (0, postgres_1.default)(process.env.PG_DB_URL || '', { max: 1 });
const db = (0, postgres_js_1.drizzle)(exports.sql, { schema, logger: false });
exports.default = db;
