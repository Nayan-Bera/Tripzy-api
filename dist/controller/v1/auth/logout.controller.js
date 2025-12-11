"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const joi_1 = __importDefault(require("joi"));
const db_1 = __importDefault(require("../../../db"));
const schema_1 = require("../../../db/schema");
const logoutSchema = joi_1.default.object({
    refresh_token: joi_1.default.string().required(),
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = logoutSchema.validate(req.body);
    if (error) {
        next(error);
        return;
    }
    try {
        yield db_1.default.delete(schema_1.refreshTokens).where((0, drizzle_orm_1.eq)(schema_1.refreshTokens.token, req.body.refresh_token));
        res.json({ status: 1 });
        return;
    }
    catch (err) {
        next(new Error('Something went wrong in the database'));
        return;
    }
});
exports.logout = logout;
