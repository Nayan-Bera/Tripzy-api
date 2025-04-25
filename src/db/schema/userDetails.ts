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
    pan_number:varchar('pan_number').notNull(),
    aadhar_number:varchar('aadhar_number').notNull(),
    address:varchar('address').notNull(),
    city:varchar('city').notNull(),
    state:varchar('state').notNull(),
    country:varchar('country').notNull(),
    pincode:varchar('pincode').notNull(),
    
   
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
