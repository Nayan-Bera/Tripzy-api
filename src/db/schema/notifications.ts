import { relations } from "drizzle-orm";
import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import users from "./user";

 const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export default notifications;
