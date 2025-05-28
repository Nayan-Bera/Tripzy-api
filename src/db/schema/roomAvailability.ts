import { relations } from "drizzle-orm";
import { pgTable, uuid, integer, time } from "drizzle-orm/pg-core";
import rooms from "./room";

export const roomAvailabilities = pgTable("room_availabilities", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  roomId: uuid("room_id").notNull().references(() => rooms.id),
  dayOfWeek: integer("day_of_week").notNull(),
  openTime: time("open_time").notNull(),
  closeTime: time("close_time").notNull(),
});

export const roomAvailabilityRelations = relations(roomAvailabilities, ({ one }) => ({
  room: one(rooms, {
    fields: [roomAvailabilities.roomId],
    references: [rooms.id],
  }),
}));

export default roomAvailabilities;
