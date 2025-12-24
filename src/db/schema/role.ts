import { relations } from 'drizzle-orm';
import {
    pgTable,
    timestamp,
    uuid,
    varchar
} from 'drizzle-orm/pg-core';
import users from './user';
import rolePermissions from './rolePermission';
import hotelUsers from './hotelUser';


const role = pgTable('role', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name:varchar('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const roleRelations = relations(role, ({ many }) => ({
   hotelUsers: many(hotelUsers),
   rolePermissions: many(rolePermissions),
}));

export default role;
