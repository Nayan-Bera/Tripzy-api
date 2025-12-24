import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import role from "./role";
import permissions from "./permission";
import { relations } from "drizzle-orm";

const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => role.id, { onDelete: "cascade" }),

    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey(t.roleId, t.permissionId),
  })
);

export default rolePermissions;

export const rolePermissionRelations = relations(rolePermissions, ({ one }) => ({
  role: one(role, {
    fields: [rolePermissions.roleId],
    references: [role.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));
