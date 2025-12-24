import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import rolePermissions from "./rolePermission";

 const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key").notNull().unique(),
});

export default permissions;

export const permissionRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));