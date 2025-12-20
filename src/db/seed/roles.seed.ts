import db from "../index";
import role from "../schema/role";
import { eq } from "drizzle-orm";

const roles = [
  { name: "admin" },
  { name: "super_admin" },
  { name: "hotel" },
  { name: "user" },
];

export default {
  name: "Roles Seeder",

  async run() {
    for (const r of roles) {
      const exists = await db.query.role.findFirst({
        where: eq(role.name, r.name),
      });

      if (!exists) {
        await db.insert(role).values(r);
        console.log(`✔ Role created: ${r.name}`);
      }
    }
  },
};
