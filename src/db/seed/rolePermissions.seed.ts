import db from "..";
import { rolePermissions } from "../schema";


const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  hotel_owner: [
    "hotel.view",
    "hotel.update",

    "room.create",
    "room.update",
    "room.delete",

    "booking.view",
    "booking.manage",

    "staff.invite",
    "staff.remove",
  ],

  hotel_admin: [
    "hotel.view",

    "room.create",
    "room.update",

    "booking.view",
    "booking.manage",

    "staff.invite",
  ],

  hotel_staff: [
    "hotel.view",
    "booking.view",
  ],
};

export async function seedRolePermissions() {
  for (const roleName in ROLE_PERMISSION_MAP) {
    const roleRow = await db.query.role.findFirst({
      where: (r, { eq }) => eq(r.name, roleName),
    });

    if (!roleRow) continue;

    for (const permKey of ROLE_PERMISSION_MAP[roleName]) {
      const permRow = await db.query.permissions.findFirst({
        where: (p, { eq }) => eq(p.key, permKey),
      });

      if (!permRow) continue;

      await db
        .insert(rolePermissions)
        .values({
          roleId: roleRow.id,
          permissionId: permRow.id,
        })
        .onConflictDoNothing();
    }
  }

  console.log("✅ Role permissions mapped");
}
