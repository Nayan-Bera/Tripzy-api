import db from "..";
import { role } from "../schema";


const HOTEL_ROLES = [
  "hotel_owner",
  "hotel_admin",
  "hotel_staff",
];

export async function seedRoles() {
  for (const name of HOTEL_ROLES) {
    await db
      .insert(role)
      .values({ name })
      .onConflictDoNothing();
  }

  console.log("✅ Hotel roles seeded");
}
