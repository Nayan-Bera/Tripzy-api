import { seedPermissions } from './permissions.seed';
import { seedRoles } from './roles.seed';
import { seedRolePermissions } from './rolePermissions.seed';
import usersHotelsSeeder from './users.seed';
import amenitiesSeeder from './aminitiea.seed';

async function runSeeds() {
    await amenitiesSeeder.run();
    await seedPermissions();
    await seedRoles();
    await seedRolePermissions();
    await usersHotelsSeeder.run();
    process.exit(0);
}

runSeeds();

// Email	Password
// super@demo.com
// 	Abc@123
// admin@demo.com
// 	Abc@123
// user@demo.com
// 	Abc@123
// owner@demo.com
// 	Abc@123
// staff@demo.com
// 	Abc@123
