import { relations } from 'drizzle-orm';
import {
    pgTable,
    timestamp,
    uuid,
    varchar
} from 'drizzle-orm/pg-core';
import users from './user';


const role = pgTable('role', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name:varchar('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const roleRelations = relations(role, ({ many }) => ({
   user: many(users),
}));

export default role;
