import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import users from "./user";
import hotels from "./hotel";
import role from "./role";

const hotelUsers = pgTable("hotel_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  hotelId: uuid("hotel_id").references(() => hotels.id).notNull(),
  roleId: uuid("role_id").references(() => role.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
