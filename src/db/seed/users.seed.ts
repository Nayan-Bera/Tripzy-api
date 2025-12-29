import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import db from "../index";

import users from "../schema/user";
import role from "../schema/role";
import hotels from "../schema/hotel";
import hotelUsers from "../schema/hotelUser";

const PASSWORD = "password123";
const SALT = 10;

export default {
  name: "Users + Hotels Seeder",

  async run() {
    const hashedPassword = await bcrypt.hash(PASSWORD, SALT);

    /* ================= FETCH ROLES ================= */

    const superAdminRole = await db.query.role.findFirst({
      where: eq(role.name, "super_admin"),
    });
    const adminRole = await db.query.role.findFirst({
      where: eq(role.name, "admin"),
    });
    const hotelRole = await db.query.role.findFirst({
      where: eq(role.name, "hotel"),
    });
    const userRole = await db.query.role.findFirst({
      where: eq(role.name, "user"),
    });

    if (!superAdminRole || !adminRole || !hotelRole || !userRole) {
      throw new Error("❌ Roles not seeded. Run roles seeder first.");
    }

    /* ================= USERS ================= */

    const [superAdmin] = await db
      .insert(users)
      .values({
        name: "Super Admin",
        email: "super@demo.com",
        password: hashedPassword,
        platformRole: "super_admin",
        email_verified: true,
      })
      .onConflictDoNothing()
      .returning();

    const [admin] = await db
      .insert(users)
      .values({
        name: "Admin User",
        email: "admin@demo.com",
        password: hashedPassword,
        platformRole: "admin",
        email_verified: true,
      })
      .onConflictDoNothing()
      .returning();

    const [normalUser] = await db
      .insert(users)
      .values({
        name: "Normal User",
        email: "user@demo.com",
        password: hashedPassword,
        platformRole: "user",
        email_verified: true,
      })
      .onConflictDoNothing()
      .returning();

    const [hotelOwner] = await db
      .insert(users)
      .values({
        name: "Hotel Owner",
        email: "owner@demo.com",
        password: hashedPassword,
        platformRole: "hotel",
        email_verified: true,
      })
      .onConflictDoNothing()
      .returning();

    const [hotelStaff] = await db
      .insert(users)
      .values({
        name: "Hotel Staff",
        email: "staff@demo.com",
        password: hashedPassword,
        platformRole: "user",
        email_verified: true,
      })
      .onConflictDoNothing()
      .returning();

    /* ================= HOTEL ================= */

    const [demoHotel] = await db
      .insert(hotels)
      .values({
        name: "Demo Hotel",
        contact: "+1-555-123-4567",
        ownerId: hotelOwner.id,
        verified: true,
      })
      .returning();

    /* ================= HOTEL ACCESS ================= */

    await db.insert(hotelUsers).values([
      {
        userId: hotelOwner.id,
        hotelId: demoHotel.id,
        roleId: hotelRole.id, // OWNER
      },
      {
        userId: hotelStaff.id,
        hotelId: demoHotel.id,
        roleId: userRole.id, // STAFF
      },
    ]);

    console.log("✅ Seeder completed successfully");
    console.log("🔑 Default password for all users:", PASSWORD);
    console.log("🏨 Demo hotel created:", demoHotel.name);
  },
};


// | Role        | Email                                   | Password    | Hotel Access   |
// | ----------- | --------------------------------------- | ----------- | -------------- |
// | Super Admin | [super@demo.com](mailto:super@demo.com) | password123 | ALL            |
// | Admin       | [admin@demo.com](mailto:admin@demo.com) | password123 | ALL            |
// | Hotel Owner | [owner@demo.com](mailto:owner@demo.com) | password123 | Own hotel      |
// | Hotel Staff | [staff@demo.com](mailto:staff@demo.com) | password123 | Assigned hotel |
// | Normal User | [user@demo.com](mailto:user@demo.com)   | password123 | None           |
