import { relations } from "drizzle-orm";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import users from "./user";
import properties from "./properties";

const favorites = pgTable("favorites", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  propertyId: uuid("property_id").notNull().references(() => properties.id),
});

export const favoriteRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [favorites.propertyId],
    references: [properties.id],
  }),
}));

export default favorites;
