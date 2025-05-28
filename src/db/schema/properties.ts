import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import hotels from "./hotel";
import rooms from "./room";
import bookings from "./booking";
import images from "./image";
import reviews from "./reviews";
import favorites from "./favorites";


 const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  hotelId: uuid("hotel_id").notNull().references(() => hotels.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  amenities: jsonb("amenities").notNull(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const propertyRelations = relations(properties, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [properties.hotelId],
    references: [hotels.id],
  }),
  rooms: many(rooms),
  bookings: many(bookings),
  images: many(images),
  reviews: many(reviews),
  favorites: many(favorites),
}));

export default properties;
