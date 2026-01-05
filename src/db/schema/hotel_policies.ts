import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import hotels from "./hotel";
import { relations } from "drizzle-orm";

const hotelPolicies = pgTable("hotel_policies", {
  id: uuid("id").defaultRandom().primaryKey(),
  hotelId: uuid("hotel_id").references(() => hotels.id).notNull(),
  checkInTime: varchar("check_in_time"),
  checkOutTime: varchar("check_out_time"),
  cancellationPolicy: varchar("cancellation_policy"),
  refundPolicy: varchar("refund_policy"),
});
export default hotelPolicies;

export const hotelPoliciesRelations = relations(hotelPolicies, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelPolicies.hotelId],
    references: [hotels.id],
  }),
}));