import { relations } from "drizzle-orm";
import { pgTable, uuid, integer } from "drizzle-orm/pg-core";
import bookings from "./booking";
import rooms from "./room";

export const bookingRooms = pgTable("booking_rooms", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id),
  roomId: uuid("room_id").notNull().references(() => rooms.id),
  quantity: integer("quantity").notNull(),
});

export const bookingRoomRelations = relations(bookingRooms, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingRooms.bookingId],
    references: [bookings.id],
  }),
  room: one(rooms, {
    fields: [bookingRooms.roomId],
    references: [rooms.id],
  }),
}));

export default bookingRooms;
