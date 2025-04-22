import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';

const user = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    fullname: varchar('fullname').notNull(),
    email: varchar('email').notNull(),
    password: varchar('password').notNull(),
    role: varchar('role', {
        enum: ['customer', 'admin', 'provider'],
    }).default('customer'),
    avatar: varchar('avatar'),
    phone_number: varchar('phone_number').notNull(),
    address: varchar('address'),
    status: varchar('status', {
        enum: ['active', 'inactive', 'suspended', 'deleted'],
    }).default('active'),
    email_verified: boolean('email_verified').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const userRelations = relations(user, ({ one, many }) => ({}));

export default user;
