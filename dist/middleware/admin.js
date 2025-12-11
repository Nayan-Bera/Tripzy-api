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
const db_1 = __importDefault(require("../db"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const role_1 = __importDefault(require("../constant/role"));
const customErrorHandaler_1 = __importDefault(require("../Services/customErrorHandaler"));
const admin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRes = yield db_1.default.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users === null || schema_1.users === void 0 ? void 0 : schema_1.users.id, req.user.id),
        });
        if ((userRes === null || userRes === void 0 ? void 0 : userRes.role) === role_1.default.ADMIN ||
            (userRes === null || userRes === void 0 ? void 0 : userRes.role) === role_1.default.SUPER_ADMIN) {
            if (userRes === null || userRes === void 0 ? void 0 : userRes.email_verified) {
                next();
            }
            else {
                return next(customErrorHandaler_1.default.notAllowed('User is not verified'));
            }
        }
        else {
            return next(customErrorHandaler_1.default.unAuthorized());
        }
    }
    catch (err) {
        return next(customErrorHandaler_1.default.serverError(err.message));
    }
});
exports.default = admin;
