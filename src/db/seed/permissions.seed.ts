import db from "..";
import { permissions } from "../schema";

const PERMISSIONS = [
  "hotel.view",
  "hotel.update",

  "room.create",
  "room.update",
  "room.delete",

  "booking.view",
  "booking.manage",

  "staff.invite",
  "staff.remove",
];

export async function seedPermissions() {
  for (const key of PERMISSIONS) {
    await db
      .insert(permissions)
      .values({ key })
      .onConflictDoNothing();
  }

  console.log("✅ Permissions seeded");
}
