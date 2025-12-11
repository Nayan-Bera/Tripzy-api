"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseData = (res, email_verified, phone_verified, role, access_token, refresh_token) => {
    res.json({
        email_verified,
        phone_verified,
        role,
        access_token,
        refresh_token,
    });
};
exports.default = responseData;
