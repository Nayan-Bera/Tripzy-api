"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_core_1 = require("drizzle-orm/pg-core");
const contectus = (0, pg_core_1.pgTable)('ContectUs', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey().notNull(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    email: (0, pg_core_1.varchar)('email').notNull(),
    phone: (0, pg_core_1.varchar)('phone').notNull(),
    subject: (0, pg_core_1.varchar)('subject').notNull(),
    message: (0, pg_core_1.varchar)('message').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { mode: 'string' })
        .notNull()
        .defaultNow(),
});
exports.default = contectus;
