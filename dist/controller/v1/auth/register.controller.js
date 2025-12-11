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
exports.userRegister = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const config_1 = require("../../../config");
const db_1 = __importDefault(require("../../../db"));
const schema_1 = require("../../../db/schema");
const customErrorHandaler_1 = __importDefault(require("../../../Services/customErrorHandaler"));
const emailOtpService_1 = __importDefault(require("../../../Services/emailOtpService"));
const jwtService_1 = __importDefault(require("../../../Services/jwtService"));
const responseHandealer_1 = __importDefault(require("../../../utils/responseHandealer"));
const register_validator_1 = __importDefault(require("../../../validators/auth/register.validator"));
const userRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = register_validator_1.default.validate(req.body);
        if (error)
            return next(error);
        const exist = yield db_1.default.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.email, req.body.email),
        });
        if (exist) {
            return next(customErrorHandaler_1.default.alreadyExist('This email address has already been used'));
        }
        if (req.body.role === 'admin || ADMIN' ||
            req.body.role === 'superAdmin || SUPER_ADMIN') {
            return next(customErrorHandaler_1.default.alreadyExist('You are not allowed to create an account'));
        }
        const { name, email, password, role, phone_number } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.config.SALT));
        const [saveUser] = yield db_1.default
            .insert(schema_1.users)
            .values({
            name,
            email,
            password: hashedPassword,
            role,
            phone_number,
        })
            .returning({
            id: schema_1.users.id,
            fullname: schema_1.users.name,
            email: schema_1.users.email,
            role: schema_1.users.role,
            email_verified: schema_1.users.email_verified,
        });
        (0, emailOtpService_1.default)({ id: saveUser.id, email: saveUser.email }, res, next);
        const access_token = jwtService_1.default.sign({ id: saveUser.id, role: saveUser.role });
        const refresh_token = jwtService_1.default.sign({ id: saveUser.id, role: saveUser.role }, '1y', config_1.config.REFRESH_SECRET);
        yield db_1.default.insert(schema_1.refreshTokens).values({ token: refresh_token });
        // DON'T return the Response object — send it and then return void
        res.status(201).send((0, responseHandealer_1.default)(201, 'success', {
            name: saveUser.fullname,
            email: saveUser.email,
            email_verified: saveUser.email_verified,
            role: saveUser === null || saveUser === void 0 ? void 0 : saveUser.role,
            access_token,
            refresh_token,
        }));
        return; // explicitly return void
    }
    catch (error) {
        return next(error);
    }
});
exports.userRegister = userRegister;
