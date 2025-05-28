import { relations } from "drizzle-orm";
import { pgTable, uuid, text, varchar } from "drizzle-orm/pg-core";
import users from "./user";
import bookings from "./booking";

 const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  documentType: varchar("document_type", { enum: ["passport", "aadhar", "license", "other"] }).notNull(),
  documentNumber: text("document_number").notNull(),
  documentFileUrl: text("document_file_url").notNull(),
});

export const documentRelations = relations(documents, ({ one }) => ({
  booking: one(bookings, {
    fields: [documents.bookingId],
    references: [bookings.id],
  }),
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

export default documents;
