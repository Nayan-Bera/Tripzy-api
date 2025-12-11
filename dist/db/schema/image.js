"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRelations = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const room_1 = __importDefault(require("./room"));
const user_1 = __importDefault(require("./user"));
const properties_1 = __importDefault(require("./properties"));
const images = (0, pg_core_1.pgTable)("images", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull(),
    url: (0, pg_core_1.text)("url").notNull(),
    propertyId: (0, pg_core_1.uuid)("property_id").references(() => properties_1.default.id),
    roomId: (0, pg_core_1.uuid)("room_id").references(() => room_1.default.id),
    uploadedBy: (0, pg_core_1.uuid)("uploaded_by").notNull().references(() => user_1.default.id),
});
exports.imageRelations = (0, drizzle_orm_1.relations)(images, ({ one }) => ({
    property: one(properties_1.default, {
        fields: [images.propertyId],
        references: [properties_1.default.id],
    }),
    room: one(room_1.default, {
        fields: [images.roomId],
        references: [room_1.default.id],
    }),
    uploadedByUser: one(user_1.default, {
        fields: [images.uploadedBy],
        references: [user_1.default.id],
    }),
}));
exports.default = images;
