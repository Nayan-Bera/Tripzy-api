import { relations } from "drizzle-orm";
import { pgTable, uuid, timestamp, varchar, text } from "drizzle-orm/pg-core";
import users from "./user";
import properties from "./property";
import bookingRooms from "./bookingRoom";
import payments from "./payment";

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  propertyId: uuid("property_id").notNull().references(() => properties.id),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  status: varchar("status", { enum: ["pending", "confirmed", "cancelled", "checked_in", "completed"] }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  otpCode: text("otp_code").notNull(),
  qrCode: text("qr_code").notNull(),
  verifiedAt: timestamp("verified_at"),
});

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [bookings.propertyId],
    references: [properties.id],
  }),
  bookingRooms: many(bookingRooms),
  payments: many(payments),
}));

export default bookings;
