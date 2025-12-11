"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = __importDefault(require("./user"));
const properties_1 = __importDefault(require("./properties"));
const bookingRooms_1 = __importDefault(require("./bookingRooms"));
const payments_1 = __importDefault(require("./payments"));
const bookings = (0, pg_core_1.pgTable)("bookings", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    userId: (0, pg_core_1.uuid)("user_id").notNull().references(() => user_1.default.id),
    propertyId: (0, pg_core_1.uuid)("property_id").notNull().references(() => properties_1.default.id),
    checkIn: (0, pg_core_1.timestamp)("check_in").notNull(),
    checkOut: (0, pg_core_1.timestamp)("check_out").notNull(),
    status: (0, pg_core_1.varchar)("status", { enum: ["pending", "confirmed", "cancelled", "checked_in", "completed"] }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    otpCode: (0, pg_core_1.text)("otp_code").notNull(),
    qrCode: (0, pg_core_1.text)("qr_code").notNull(),
    verifiedAt: (0, pg_core_1.timestamp)("verified_at"),
});
exports.bookingRelations = (0, drizzle_orm_1.relations)(bookings, ({ one, many }) => ({
    user: one(user_1.default, {
        fields: [bookings.userId],
        references: [user_1.default.id],
    }),
    property: one(properties_1.default, {
        fields: [bookings.propertyId],
        references: [properties_1.default.id],
    }),
    bookingRooms: many(bookingRooms_1.default),
    payments: many(payments_1.default),
}));
exports.default = bookings;
