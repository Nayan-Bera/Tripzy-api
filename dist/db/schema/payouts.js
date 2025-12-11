"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const hotel_1 = __importDefault(require("./hotel"));
const payouts = (0, pg_core_1.pgTable)("payouts", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    hotelId: (0, pg_core_1.uuid)("hotel_id").notNull().references(() => hotel_1.default.id),
    amount: (0, pg_core_1.numeric)("amount", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { enum: ["pending", "completed", "failed"] }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.payoutRelations = (0, drizzle_orm_1.relations)(payouts, ({ one }) => ({
    hotel: one(hotel_1.default, {
        fields: [payouts.hotelId],
        references: [hotel_1.default.id],
    }),
}));
exports.default = payouts;
