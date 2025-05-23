import { relations } from 'drizzle-orm';
import {
    pgTable,
    timestamp,
    uuid,
    varchar,
    boolean,
    jsonb
} from 'drizzle-orm/pg-core';
import user from './user';
import properties from './properties';

const hotelStaff = pgTable('hotel_staff', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id')
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    propertyId: uuid('property_id')
        .references(() => properties.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        })
        .notNull(),
    role: varchar('role', {
        enum: ['manager', 'receptionist', 'housekeeping', 'maintenance'],
    }).notNull(),
    permissions: jsonb('permissions').notNull().default({
        canCheckIn: false,
        canCheckOut: false,
        canManageBookings: false,
        canManageRooms: false,
        canManageStaff: false,
        canViewReports: false,
        canManageInventory: false,
    }),
    isActive: boolean('is_active').default(true),
    lastActive: timestamp('last_active', { mode: 'string' }),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const hotelStaffRelations = relations(hotelStaff, ({ one }) => ({
    user: one(user, {
        fields: [hotelStaff.userId],
        references: [user.id],
    }),
    property: one(properties, {
        fields: [hotelStaff.propertyId],
        references: [properties.id],
    }),
}));

export default hotelStaff; 