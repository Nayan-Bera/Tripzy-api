import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import coupons from './coupons';
import user from './user';
 const userCoupons = pgTable('user_coupons', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id')
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    couponId: uuid('coupon_id')
        .references(() => coupons.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    isUsed: boolean('is_used').default(false),
    usedAt: timestamp('used_at', { mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const userCouponsRelations = relations(userCoupons, ({ one }) => ({
    user: one(user, {
        fields: [userCoupons.userId],
        references: [user.id],
    }),
    coupon: one(coupons, {
        fields: [userCoupons.couponId],
        references: [coupons.id],
    }),
}));

export default userCoupons;