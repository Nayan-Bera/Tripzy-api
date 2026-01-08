import { relations } from "drizzle-orm";
import { pgTable, uuid, text, boolean, varchar } from "drizzle-orm/pg-core";
import users from "./user";
import properties from "./properties";
import payouts from "./payouts";
import hotelUsers from "./hotelUser";
import hotelPolicies from "./hotel_policies";
import hotelDocuments from "./hotel_documents";


 const hotels = pgTable("hotels", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  verified: boolean("verified").notNull().default(false),
  status: varchar("status", {
    enum: ["active", "inactive"],
  })
    .default("inactive")
    .notNull(),
});

export const hotelRelations = relations(hotels, ({ one, many }) => ({
  owner: one(users, {
    fields: [hotels.ownerId],
    references: [users.id],
  }),
  properties: many(properties),
  payouts: many(payouts),
  staff: many(hotelUsers),
  hotelPolicies: many(hotelPolicies),
  hotelDocuments: many(hotelDocuments),
}));

export default hotels;
