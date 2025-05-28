import { relations } from "drizzle-orm";
import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";
import hotels from "./hotel";
import bookings from "./booking";
import documents from "./documents";
import images from "./image";
import reviews from "./reviews";
import favorites from "./favorites";
import notifications from "./notifications";
import refreshTokens from "./refreshtoken";
import otps from "./emailOtp";
import familyMembers from "./familymabers";

 const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { enum: ["user", "hotel", "admin"] }).notNull(),
  status: varchar("status", { enum: ["active", "inactive"] }).notNull(),
  avatar:varchar("avatar"),
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
