import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import users from "./user";
import hotels from "./hotel";
import role from "./role";
import { relations } from "drizzle-orm";
import { unique } from "drizzle-orm/pg-core";

const hotelUsers = pgTable(
  "hotel_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    hotelId: uuid("hotel_id").references(() => hotels.id).notNull(),
    roleId: uuid("role_id").references(() => role.id).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    uniqueUserHotel: unique().on(t.userId, t.hotelId),
  })
);

export default hotelUsers;

// hotelUsers.ts
export const hotelUserRelations = relations(hotelUsers, ({ one }) => ({
  user: one(users, {
    fields: [hotelUsers.userId],
    references: [users.id],
  }),
  hotel: one(hotels, {
    fields: [hotelUsers.hotelId],
    references: [hotels.id],
  }),
  role: one(role, {
    fields: [hotelUsers.roleId],
    references: [role.id],
  }),
}));
