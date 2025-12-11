"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const hotel_1 = __importDefault(require("./hotel"));
const room_1 = __importDefault(require("./room"));
const booking_1 = __importDefault(require("./booking"));
const image_1 = __importDefault(require("./image"));
const reviews_1 = __importDefault(require("./reviews"));
const favorites_1 = __importDefault(require("./favorites"));
const properties = (0, pg_core_1.pgTable)("properties", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    hotelId: (0, pg_core_1.uuid)("hotel_id").notNull().references(() => hotel_1.default.id),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    address: (0, pg_core_1.text)("address").notNull(),
    city: (0, pg_core_1.text)("city").notNull(),
    state: (0, pg_core_1.text)("state").notNull(),
    zip: (0, pg_core_1.text)("zip").notNull(),
    amenities: (0, pg_core_1.jsonb)("amenities").notNull(),
    location: (0, pg_core_1.text)("location").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.propertyRelations = (0, drizzle_orm_1.relations)(properties, ({ one, many }) => ({
    hotel: one(hotel_1.default, {
        fields: [properties.hotelId],
        references: [hotel_1.default.id],
    }),
    rooms: many(room_1.default),
    bookings: many(booking_1.default),
    images: many(image_1.default),
    reviews: many(reviews_1.default),
    favorites: many(favorites_1.default),
}));
exports.default = properties;
