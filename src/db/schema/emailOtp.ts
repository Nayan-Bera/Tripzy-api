import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import user from './user';

const emailOtp = pgTable('email_otps', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id')
        .notNull()
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        }),
    otp: varchar('otp').notNull(),
    generatedAt: varchar('generatedAt').notNull(),
    expiresAt: varchar('expiresAt').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const emailOtpRelations = relations(emailOtp, ({ one }) => ({
    user: one(user, {
        fields: [emailOtp.user_id],
        references: [user.id],
    }),
}));

export default emailOtp;
