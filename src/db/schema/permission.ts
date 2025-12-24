import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

 const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key").notNull().unique(),
});

export default permissions;