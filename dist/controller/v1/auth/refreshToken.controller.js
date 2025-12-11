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
exports.refresh = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const joi_1 = __importDefault(require("joi"));
const config_1 = require("../../../config");
const db_1 = __importDefault(require("../../../db"));
const schema_1 = require("../../../db/schema");
const customErrorHandaler_1 = __importDefault(require("../../../Services/customErrorHandaler"));
const jwtService_1 = __importDefault(require("../../../Services/jwtService"));
const refreshSchema = joi_1.default.object({
    refresh_token: joi_1.default.string().required(),
});
const refresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = refreshSchema.validate(req.body);
    if (error) {
        next(error);
        return;
    }
    try {
        const refreshTokenDocument = yield db_1.default.query.refreshTokens.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.refreshTokens.token, req.body.refresh_token),
        });
        if (!refreshTokenDocument || !refreshTokenDocument.token) {
            next(customErrorHandaler_1.default.unAuthorized('Invalid refresh token'));
            return;
        }
        let userId;
        try {
            const { id } = (yield jwtService_1.default.verify(refreshTokenDocument.token, config_1.config.REFRESH_SECRET));
            userId = id;
        }
        catch (err) {
            next(customErrorHandaler_1.default.unAuthorized('Invalid refresh token'));
            return;
        }
        const userRes = yield db_1.default.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId),
        });
        if (!userRes) {
            next(customErrorHandaler_1.default.unAuthorized('No user found!'));
            return;
        }
        const access_token = jwtService_1.default.sign({
            id: userRes.id,
            role: userRes.role,
        });
        const refresh_token = jwtService_1.default.sign({ id: userRes.id, role: userRes.role }, '1y', config_1.config.REFRESH_SECRET);
        yield db_1.default
            .update(schema_1.refreshTokens)
            .set({ token: refresh_token })
            .where((0, drizzle_orm_1.eq)(schema_1.refreshTokens.token, req.body.refresh_token));
        res.json({ access_token, refresh_token });
        return;
    }
    catch (err) {
        next(new Error('Something went wrong'));
        return;
    }
});
exports.refresh = refresh;
