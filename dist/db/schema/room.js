"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const properties_1 = __importDefault(require("./properties"));
const bookingRooms_1 = __importDefault(require("./bookingRooms"));
const roomAvailability_1 = __importDefault(require("./roomAvailability"));
const unAvailaibility_1 = __importDefault(require("./unAvailaibility"));
const image_1 = __importDefault(require("./image"));
const rooms = (0, pg_core_1.pgTable)("rooms", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    propertyId: (0, pg_core_1.uuid)("property_id").notNull().references(() => properties_1.default.id),
    name: (0, pg_core_1.text)("name").notNull(),
    type: (0, pg_core_1.varchar)("type", { enum: ["single", "double", "suite"] }).notNull(),
    pricePerHour: (0, pg_core_1.numeric)("price_per_hour", { precision: 10, scale: 2 }).notNull(),
    pricePerDay: (0, pg_core_1.numeric)("price_per_day", { precision: 10, scale: 2 }).notNull(),
    capacity: (0, pg_core_1.integer)("capacity").notNull(),
});
exports.roomRelations = (0, drizzle_orm_1.relations)(rooms, ({ one, many }) => ({
    property: one(properties_1.default, {
        fields: [rooms.propertyId],
        references: [properties_1.default.id],
    }),
    bookingRooms: many(bookingRooms_1.default),
    availabilities: many(roomAvailability_1.default),
    unavailabilities: many(unAvailaibility_1.default),
    images: many(image_1.default),
}));
exports.default = rooms;
