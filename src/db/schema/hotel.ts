import { relations } from "drizzle-orm";
import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import users from "./user";
import properties from "./property";
import payouts from "./payout";

export const hotels = pgTable("hotels", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  verified: boolean("verified").notNull().default(false),
});

export const hotelRelations = relations(hotels, ({ one, many }) => ({
  user: one(users, {
    fields: [hotels.userId],
    references: [users.id],
  }),
  properties: many(properties),
  payouts: many(payouts),
}));

export default hotels;
