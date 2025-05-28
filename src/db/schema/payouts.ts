import { relations } from "drizzle-orm";
import { pgTable, uuid, numeric, varchar, timestamp } from "drizzle-orm/pg-core";
import hotels from "./hotel";

const payouts = pgTable("payouts", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  hotelId: uuid("hotel_id").notNull().references(() => hotels.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { enum: ["pending", "completed", "failed"] }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payoutRelations = relations(payouts, ({ one }) => ({
  hotel: one(hotels, {
    fields: [payouts.hotelId],
    references: [hotels.id],
  }),
}));

export default payouts;
