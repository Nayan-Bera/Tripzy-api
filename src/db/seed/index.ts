import "dotenv/config";

import fs from "fs";
import path from "path";

async function runSeeders() {
  const seedDir = __dirname;

  const files = fs
    .readdirSync(seedDir)
    .filter(
      (file) =>
        file.endsWith(".seed.ts") ||
        file.endsWith(".seed.js")
    );

  for (const file of files) {
    const seeder = await import(path.join(seedDir, file));

    if (typeof seeder.default?.run === "function") {
      console.log(`🌱 Running seeder: ${seeder.default.name}`);
      await seeder.default.run();
    }
  }

  console.log("✅ All seeders executed");
  process.exit(0);
}

runSeeders().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
