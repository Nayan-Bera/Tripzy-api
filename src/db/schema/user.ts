import { relations } from "drizzle-orm";
import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";
import hotels from "./hotel";
import bookings from "./booking";
import documents from "./document";
import familyMembers from "./familyMember";
import images from "./image";
import reviews from "./review";
import favorites from "./favorite";
import notifications from "./notification";
import refreshTokens from "./refreshToken";
import otps from "./otp";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { enum: ["user", "hotel", "admin"] }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  hotels: many(hotels),
  bookings: many(bookings),
  documents: many(documents),
  familyMembers: many(familyMembers),
  images: many(images),
  reviews: many(reviews),
  favorites: many(favorites),
  notifications: many(notifications),
  refreshTokens: many(refreshTokens),
  otps: many(otps),
}));

export default users;
