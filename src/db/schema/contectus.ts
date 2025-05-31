import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

const contectus = pgTable('ContectUs', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
    phone: varchar('phone').notNull(),
    subject: varchar('subject').notNull(),
    message: varchar('message').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export default contectus;
