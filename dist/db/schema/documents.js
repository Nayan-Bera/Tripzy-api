"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = __importDefault(require("./user"));
const booking_1 = __importDefault(require("./booking"));
const documents = (0, pg_core_1.pgTable)("documents", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    bookingId: (0, pg_core_1.uuid)("booking_id").notNull().references(() => booking_1.default.id),
    userId: (0, pg_core_1.uuid)("user_id").notNull().references(() => user_1.default.id),
    documentType: (0, pg_core_1.varchar)("document_type", { enum: ["passport", "aadhar", "license", "other"] }).notNull(),
    documentNumber: (0, pg_core_1.text)("document_number").notNull(),
    documentFileUrl: (0, pg_core_1.text)("document_file_url").notNull(),
});
exports.documentRelations = (0, drizzle_orm_1.relations)(documents, ({ one }) => ({
    booking: one(booking_1.default, {
        fields: [documents.bookingId],
        references: [booking_1.default.id],
    }),
    user: one(user_1.default, {
        fields: [documents.userId],
        references: [user_1.default.id],
    }),
}));
exports.default = documents;
