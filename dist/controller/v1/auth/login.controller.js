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
exports.userLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const config_1 = require("../../../config");
const db_1 = __importDefault(require("../../../db"));
const schema_1 = require("../../../db/schema");
const customErrorHandaler_1 = __importDefault(require("../../../Services/customErrorHandaler"));
const responseHandealer_1 = __importDefault(require("../../../utils/responseHandealer"));
const login_validator_1 = __importDefault(require("../../../validators/auth/login.validator"));
const jwtService_1 = __importDefault(require("../../../Services/jwtService"));
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = login_validator_1.default.validate(req.body);
        if (error)
            return next(error);
        const { email, password } = req.body;
        const userResult = yield db_1.default.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users === null || schema_1.users === void 0 ? void 0 : schema_1.users.email, email),
        });
        if (!userResult) {
            return next(customErrorHandaler_1.default.notFound('Invalid username & password'));
        }
        const matchPassword = yield bcrypt_1.default.compare(password, userResult === null || userResult === void 0 ? void 0 : userResult.password);
        if (!matchPassword) {
            return next(customErrorHandaler_1.default.wrongCredentials());
        }
        const access_token = jwtService_1.default.sign({
            id: userResult.id,
            role: userResult.role,
        });
        const refresh_token = jwtService_1.default.sign({ id: userResult.id, role: userResult.role }, '1y', config_1.config.REFRESH_SECRET);
        yield db_1.default.insert(schema_1.refreshTokens).values({ token: refresh_token });
        // send response (do NOT return the Response object)
        res.status(200).send((0, responseHandealer_1.default)(200, 'success', {
            name: userResult.name,
            email: userResult.email,
            email_verified: userResult.email_verified,
            role: userResult.role,
            access_token,
            refresh_token,
        }));
        return; // ensure Promise<void>
    }
    catch (error) {
        return next(error);
    }
});
exports.userLogin = userLogin;
