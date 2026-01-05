import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import hotels from "./hotel";
import amenities from "./aminities";
import { relations } from "drizzle-orm";

const hotelAmenities = pgTable(
  "hotel_amenities",
  {
    hotelId: uuid("hotel_id").references(() => hotels.id).notNull(),
    amenityId: uuid("amenity_id").references(() => amenities.id).notNull(),
  },
  (t) => ({
    pk: primaryKey(t.hotelId, t.amenityId),
  })
);

export default hotelAmenities;

export const hotelAmenitiesRelations = relations(hotelAmenities, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelAmenities.hotelId],
    references: [hotels.id],
  }),
  amenity: one(amenities, {
    fields: [hotelAmenities.amenityId],
    references: [amenities.id],
  }),
}));