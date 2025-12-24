import { pgTable, uuid } from "drizzle-orm/pg-core";
import role from "./role";
import permissions from "./permission";

const rolePermissions = pgTable("role_permissions", {
  roleId: uuid("role_id").references(() => role.id),
  permissionId: uuid("permission_id").references(() => permissions.id),
});

export default rolePermissions;