import { is, relations } from 'drizzle-orm';
import {
    jsonb,
    pgTable,
    timestamp,
    uuid,
    varchar,
    boolean,
} from 'drizzle-orm/pg-core';
import user from './user';
// import favorites from './favorites';
// import propertyImages from './propertyImages';
// import leads from './leads';

const properties = pgTable('properties', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    title: varchar('title').notNull(),
    description: varchar('description').notNull(),
    property_category: varchar('property_category', {
        enum: ['hotel', 'apertment ', 'villa', 'homestay'],
    }).notNull(),
    price: varchar('price').notNull(),
    location: varchar('location').notNull(),
    latitude: varchar('latitude').notNull(),
    longitude: varchar('longitude').notNull(),
    city: varchar('city').notNull(),
    state: varchar('state').notNull(),
    country: varchar('country').notNull(),
    pin: varchar('pin').notNull(),
    ownerId: uuid('owner_id')
        .notNull()
        .references(() => user.id, {
            onDelete: 'cascade',
            onUpdate: 'no action',
        }),
    status: varchar('status', {
        enum: ['active', 'inactive', 'sold', 'deleted', 'rejected'],
    }).default('inactive'),
    rejectedDescription: varchar('rejected_description'),
    details: jsonb('details').notNull(),
    isFeatured: boolean('is_featured').default(false),
    is_verified: boolean('is_verified').default(false),
    isApproved: boolean('is_approved').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});

export const propertiesRelations = relations(properties, ({ one, many }) => ({
    user: one(user, {
        fields: [properties.ownerId],
        references: [user.id],
    }),
    // favorites: many(favorites),
    // propertybookings: many(propertybookings),
    // propertyImages: many(propertyImages),
    // leads: many(leads),
}));

export default properties;
