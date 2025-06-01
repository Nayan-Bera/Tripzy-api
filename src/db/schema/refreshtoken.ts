import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import users from "./user";

const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").references(() => users.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export default refreshTokens;
