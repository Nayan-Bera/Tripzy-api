"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ResponseHandler(status, message, data) {
    return {
        status,
        message,
        data,
    };
}
exports.default = ResponseHandler;
