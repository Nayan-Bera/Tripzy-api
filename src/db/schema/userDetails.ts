import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import user from './user';

const userDetails = pgTable('user-details', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id:uuid('user_id').notNull().references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'no action',
    }),
   
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const userDetailsRelations = relations(userDetails, ({ one, many }) => ({
   user:one(user, {
       fields: [userDetails.user_id],
       references: [user.id],
   })
}));

export default user;
