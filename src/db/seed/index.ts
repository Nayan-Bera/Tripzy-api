import { seedPermissions } from "./permissions.seed";
import { seedRoles } from "./roles.seed";
import { seedRolePermissions } from "./rolePermissions.seed";
import usersHotelsSeeder  from "./users.seed";

async function runSeeds() {
  await seedPermissions();
  await seedRoles();
  await seedRolePermissions();
  await usersHotelsSeeder.run();
  process.exit(0);
}

runSeeds();
