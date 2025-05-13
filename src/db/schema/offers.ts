import { relations } from 'drizzle-orm';
import {
    boolean,
    pgTable,
    timestamp,
    uuid,
    varchar,
    jsonb,
    integer

} from 'drizzle-orm/pg-core';
 const offers = pgTable('offers', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    title: varchar('title').notNull(),
    description: varchar('description').notNull(),
    offerType: varchar('offer_type', {
        enum: ['seasonal', 'flash_sale', 'package', 'early_bird', 'last_minute'],
    }).notNull(),
    discountType: varchar('discount_type', {
        enum: ['percentage', 'fixed_amount'],
    }).notNull(),
    discountValue: integer('discount_value').notNull(),
    startDate: timestamp('start_date', { mode: 'string' }).notNull(),
    endDate: timestamp('end_date', { mode: 'string' }).notNull(),
    isActive: boolean('is_active').default(true),
    applicablePropertyTypes: jsonb('applicable_property_types'),
    applicableRoomTypes: jsonb('applicable_room_types'),
    specificPropertyIds: jsonb('specific_property_ids'),
    specificRoomIds: jsonb('specific_room_ids'),
    minStay: integer('min_stay'),
    maxStay: integer('max_stay'),
    banner: varchar('banner'),
    termsAndConditions: varchar('terms_and_conditions'),
    createdAt: timestamp('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});
export default offers;