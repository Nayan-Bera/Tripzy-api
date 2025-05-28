import { relations } from "drizzle-orm";
import { pgTable, uuid, timestamp, numeric, varchar } from "drizzle-orm/pg-core";
import bookings from "./booking";

const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { enum: ["card", "upi", "wallet"] }).notNull(),
  status: varchar("status", { enum: ["pending", "completed", "failed"] }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const paymentRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));

export default payments;
