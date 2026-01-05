import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import hotels from "./hotel";
import users from "./user";
import { relations } from "drizzle-orm";


const hotelDocuments = pgTable("hotel_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  hotelId: uuid("hotel_id").references(() => hotels.id).notNull(),
  type: varchar("type", {
    enum: ["license", "tax", "id", "other"],
  }).notNull(),
  fileUrl: varchar("file_url").notNull(),
  uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export default hotelDocuments;

export const hotelDocumentsRelations = relations(hotelDocuments, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelDocuments.hotelId],
    references: [hotels.id],
  }),
  user: one(users, {
    fields: [hotelDocuments.uploadedBy],
    references: [users.id],
  }),
}));