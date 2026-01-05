import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import hotelAmenities from "./hotelAmenities";
import { relations } from "drizzle-orm";

const amenities = pgTable("amenities", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").unique().notNull(),
});

export default amenities;

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  hotelAmenities: many(hotelAmenities),
}));