import { relations } from "drizzle-orm";
import { pgTable, uuid, text, varchar, integer, numeric } from "drizzle-orm/pg-core";
import properties from "./properties";
import bookingRooms from "./bookingRooms";
import roomAvailabilities from "./roomAvailability";
import unavailabilities from "./unAvailaibility";
import images from "./image";


 const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  propertyId: uuid("property_id").notNull().references(() => properties.id),
  name: text("name").notNull(),
  type: varchar("type", { enum: ["single", "double", "suite"] }).notNull(),
  pricePerHour: numeric("price_per_hour", { precision: 10, scale: 2 }).notNull(),
  pricePerDay: numeric("price_per_day", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
});

export const roomRelations = relations(rooms, ({ one, many }) => ({
  property: one(properties, {
    fields: [rooms.propertyId],
    references: [properties.id],
  }),
  bookingRooms: many(bookingRooms),
  availabilities: many(roomAvailabilities),
  unavailabilities: many(unavailabilities),
  images: many(images),
}));

export default rooms;
