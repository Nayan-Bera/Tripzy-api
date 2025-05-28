import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import rooms from "./room";

 const unavailabilities = pgTable("unavailabilities", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  roomId: uuid("room_id").notNull().references(() => rooms.id),
  reason: text("reason").notNull(),
  from: timestamp("from").notNull(),
  to: timestamp("to").notNull(),
});

export const unavailabilityRelations = relations(unavailabilities, ({ one }) => ({
  room: one(rooms, {
    fields: [unavailabilities.roomId],
    references: [rooms.id],
  }),
}));

export default unavailabilities;
