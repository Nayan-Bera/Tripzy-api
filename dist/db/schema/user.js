"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const hotel_1 = __importDefault(require("./hotel"));
const booking_1 = __importDefault(require("./booking"));
const documents_1 = __importDefault(require("./documents"));
const image_1 = __importDefault(require("./image"));
const reviews_1 = __importDefault(require("./reviews"));
const favorites_1 = __importDefault(require("./favorites"));
const notifications_1 = __importDefault(require("./notifications"));
const refreshtoken_1 = __importDefault(require("./refreshtoken"));
const emailOtp_1 = __importDefault(require("./emailOtp"));
const familymabers_1 = __importDefault(require("./familymabers"));
const users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    role: (0, pg_core_1.varchar)("role", { enum: ["user", "hotel", "admin"] }).notNull(),
    status: (0, pg_core_1.varchar)("status", { enum: ["active", "inactive"] }).notNull().default("active"),
    email_verified: (0, pg_core_1.boolean)("email_verified").notNull().default(false),
    phone_number: (0, pg_core_1.varchar)("phone_number"),
    avatar: (0, pg_core_1.varchar)("avatar"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.userRelations = (0, drizzle_orm_1.relations)(users, ({ one, many }) => ({
    hotels: many(hotel_1.default),
    bookings: many(booking_1.default),
    documents: many(documents_1.default),
    familyMembers: many(familymabers_1.default),
    images: many(image_1.default),
    reviews: many(reviews_1.default),
    favorites: many(favorites_1.default),
    notifications: many(notifications_1.default),
    refreshTokens: many(refreshtoken_1.default),
    otps: many(emailOtp_1.default),
}));
exports.default = users;
