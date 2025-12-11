"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = handleResponse;
function handleResponse(res, status, message, data) {
    return res.status(status).json({
        status,
        message,
        data,
    });
}
