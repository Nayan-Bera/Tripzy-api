"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoomRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const booking_1 = __importDefault(require("./booking"));
const room_1 = __importDefault(require("./room"));
const bookingRooms = (0, pg_core_1.pgTable)("booking_rooms", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    bookingId: (0, pg_core_1.uuid)("booking_id").notNull().references(() => booking_1.default.id),
    roomId: (0, pg_core_1.uuid)("room_id").notNull().references(() => room_1.default.id),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
});
exports.bookingRoomRelations = (0, drizzle_orm_1.relations)(bookingRooms, ({ one }) => ({
    booking: one(booking_1.default, {
        fields: [bookingRooms.bookingId],
        references: [booking_1.default.id],
    }),
    room: one(room_1.default, {
        fields: [bookingRooms.roomId],
        references: [room_1.default.id],
    }),
}));
exports.default = bookingRooms;
