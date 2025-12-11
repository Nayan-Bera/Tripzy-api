"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const booking_1 = __importDefault(require("./booking"));
const payments = (0, pg_core_1.pgTable)("payments", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    bookingId: (0, pg_core_1.uuid)("booking_id").notNull().references(() => booking_1.default.id),
    amount: (0, pg_core_1.numeric)("amount", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: (0, pg_core_1.varchar)("payment_method", { enum: ["card", "upi", "wallet"] }).notNull(),
    status: (0, pg_core_1.varchar)("status", { enum: ["pending", "completed", "failed"] }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.paymentRelations = (0, drizzle_orm_1.relations)(payments, ({ one }) => ({
    booking: one(booking_1.default, {
        fields: [payments.bookingId],
        references: [booking_1.default.id],
    }),
}));
exports.default = payments;
