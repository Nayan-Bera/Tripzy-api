import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";
import users from "./user";
import properties from "./properties";
import { relations } from "drizzle-orm";

 const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  propertyId: uuid("property_id").notNull().references(() => properties.id),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [reviews.propertyId],
    references: [properties.id],
  }),
}))

export default reviews;
