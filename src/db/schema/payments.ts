import { relations } from 'drizzle-orm';
import {
    integer,
    jsonb,
    pgTable,
    timestamp,
    uuid,
    varchar
} from 'drizzle-orm/pg-core';
import user from './user';
import bookings from './booking';
const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    bookingId: uuid('booking_id')
        .references(() => bookings.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    userId: uuid('user_id')
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    amount: integer('amount').notNull(),
    paymentMethod: varchar('payment_method', {
        enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'pay_at_hotel'],
    }).notNull(),
    transactionId: varchar('transaction_id'),
    status: varchar('status', {
        enum: ['pending', 'successful', 'failed', 'refunded', 'partial_refund'],
    }).default('pending'),
    paymentGateway: varchar('payment_gateway'),
    paymentDetails: jsonb('payment_details'),
    refundAmount: integer('refund_amount').default(0),
    refundReason: varchar('refund_reason'),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
    booking: one(bookings, {
        fields: [payments.bookingId],
        references: [bookings.id],
    }),
    user: one(user, {
        fields: [payments.userId],
        references: [user.id],
    }),
}));
export default payments;