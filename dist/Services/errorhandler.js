"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = require("joi");
const customErrorHandaler_1 = __importDefault(require("./customErrorHandaler"));
const responseHandealer_1 = __importDefault(require("../utils/responseHandealer"));
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let errData = {
        message: 'Internal Server Error',
        // ...(config.DEBUG_MODE === 'true' && { originError: err.message })
    };
    if (err instanceof joi_1.ValidationError) {
        statusCode = 422;
        errData = {
            message: err.message,
        };
    }
    if (err instanceof customErrorHandaler_1.default) {
        statusCode = err.status;
        errData = err.toJson();
    }
    res.status(statusCode).send((0, responseHandealer_1.default)(statusCode, errData.message));
};
exports.default = errorHandler;
