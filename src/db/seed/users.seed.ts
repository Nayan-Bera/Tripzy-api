import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import db from "../index";

import users from "../schema/user";
import role from "../schema/role";
import hotels from "../schema/hotel";
import hotelUsers from "../schema/hotelUser";

const PASSWORD = "Abc@123";
const SALT = 10;

export default {
  name: "Users + Hotels Seeder",

  async run() {
    const hashedPassword = await bcrypt.hash(PASSWORD, SALT);

    /* ================= HOTEL ROLES ================= */

    const ownerRole = await db.query.role.findFirst({
      where: eq(role.name, "hotel_owner"),
    });

    const staffRole = await db.query.role.findFirst({
      where: eq(role.name, "hotel_staff"),
    });

    if (!ownerRole || !staffRole) {
      throw new Error("Hotel roles not found. Run roles seeder first.");
    }

    /* ================= USERS ================= */

    const [superAdmin] = await db.insert(users).values({
      name: "Super Admin",
      email: "super@demo.com",
      password: hashedPassword,
      platformRole: "super_admin",
      email_verified: true,
    }).returning();

    const [admin] = await db.insert(users).values({
      name: "Admin User",
      email: "admin@demo.com",
      password: hashedPassword,
      platformRole: "admin",
      email_verified: true,
    }).returning();

    const [normalUser] = await db.insert(users).values({
      name: "Normal User",
      email: "user@demo.com",
      password: hashedPassword,
      platformRole: "user",
      email_verified: true,
    }).returning();

    const [hotelOwner] = await db.insert(users).values({
      name: "Hotel Owner",
      email: "owner@demo.com",
      password: hashedPassword,
      platformRole: "user",
      email_verified: true,
    }).returning();

    const [hotelStaff] = await db.insert(users).values({
      name: "Hotel Staff",
      email: "staff@demo.com",
      password: hashedPassword,
      platformRole: "user",
      email_verified: true,
    }).returning();

    /* ================= HOTEL ================= */

    const [demoHotel] = await db.insert(hotels).values({
      name: "Demo Hotel",
      contact: "+1-555-123-4567",
      ownerId: hotelOwner.id,
      verified: true,
    }).returning();

    /* ================= HOTEL ACCESS ================= */

    await db.insert(hotelUsers).values([
      {
        userId: hotelOwner.id,
        hotelId: demoHotel.id,
        roleId: ownerRole.id, // HOTEL_OWNER
      },
      {
        userId: hotelStaff.id,
        hotelId: demoHotel.id,
        roleId: staffRole.id, // HOTEL_STAFF
      },
    ]);

    console.log("✅ Users + Hotels seeded");
    console.log("🔑 Password:", PASSWORD);
    console.log("🏨 Hotel:", demoHotel.name);
  },
};
