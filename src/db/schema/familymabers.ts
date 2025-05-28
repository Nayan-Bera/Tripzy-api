import { relations } from "drizzle-orm";
import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import users from "./user";

 const familyMembers = pgTable("family_members", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  relation: text("relation").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
});

export const familyMemberRelations = relations(familyMembers, ({ one }) => ({
  user: one(users, {
    fields: [familyMembers.userId],
    references: [users.id],
  }),
}));

export default familyMembers;
