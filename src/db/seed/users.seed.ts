import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import db from "../index";

import users from "../schema/user";
import role from "../schema/role";
import hotels from "../schema/hotel";
import hotelUsers from "../schema/hotelUser";

const PASSWORD = "Abc@123";
const SALT = 10;

type DemoUser = typeof users.$inferInsert;

async function findOrCreateUser(data: DemoUser) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (existing) {
    return existing;
  }

  const [created] = await db.insert(users).values(data).returning();
  return created;
}

async function findOrCreateHotel(data: typeof hotels.$inferInsert) {
  const existing = await db.query.hotels.findFirst({
    where: and(eq(hotels.name, data.name), eq(hotels.ownerId, data.ownerId)),
  });

  if (existing) {
    return existing;
  }

  const [created] = await db.insert(hotels).values(data).returning();
  return created;
}

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

    await findOrCreateUser({
      name: "Super Admin",
      email: "super@demo.com",
      password: hashedPassword,
      platformRole: "super_admin",
      email_verified: true,
    });

    await findOrCreateUser({
      name: "Admin User",
      email: "admin@demo.com",
      password: hashedPassword,
      platformRole: "admin",
      email_verified: true,
    });

    await findOrCreateUser({
      name: "Normal User",
      email: "user@demo.com",
      password: hashedPassword,
      platformRole: "user",
      email_verified: true,
    });

    const hotelOwner = await findOrCreateUser({
      name: "Hotel Owner",
      email: "owner@demo.com",
      password: hashedPassword,
      platformRole: "user",
      email_verified: true,
    });

    const hotelStaff = await findOrCreateUser({
      name: "Hotel Staff",
      email: "staff@demo.com",
      password: hashedPassword,
      platformRole: "user",
      email_verified: true,
    });

    /* ================= HOTEL ================= */

    const demoHotel = await findOrCreateHotel({
      name: "Demo Hotel",
      contact: "+1-555-123-4567",
      ownerId: hotelOwner.id,
      verified: true,
      status: "active",
    });

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
    ]).onConflictDoNothing();

    console.log("✅ Users + Hotels seeded");
    console.log("🔑 Password:", PASSWORD);
    console.log("🏨 Hotel:", demoHotel.name);
  },
};
