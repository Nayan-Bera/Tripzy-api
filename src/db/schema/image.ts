import { relations } from "drizzle-orm";
import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import properties from "./property";
import rooms from "./room";
import users from "./user";

export const images = pgTable("images", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  url: text("url").notNull(),
  propertyId: uuid("property_id").references(() => properties.id),
  roomId: uuid("room_id").references(() => rooms.id),
  uploadedBy: uuid("uploaded_by").notNull().references(() => users.id),
});

export const imageRelations = relations(images, ({ one }) => ({
  property: one(properties, {
    fields: [images.propertyId],
    references: [properties.id],
  }),
  room: one(rooms, {
    fields: [images.roomId],
    references: [rooms.id],
  }),
  uploadedByUser: one(users, {
    fields: [images.uploadedBy],
    references: [users.id],
  }),
}));

export default images;
