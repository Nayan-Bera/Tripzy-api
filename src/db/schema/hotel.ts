import { relations } from "drizzle-orm";
import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import users from "./user";
import properties from "./properties";
import payouts from "./payouts";
import hotelUsers from "./hotelUser";


 const hotels = pgTable("hotels", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  verified: boolean("verified").notNull().default(false),
});

export const hotelRelations = relations(hotels, ({ one, many }) => ({
  owner: one(users, {
    fields: [hotels.ownerId],
    references: [users.id],
  }),
  properties: many(properties),
  payouts: many(payouts),
  staff: many(hotelUsers),
}));

export default hotels;
