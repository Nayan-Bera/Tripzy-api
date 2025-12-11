"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setTokensCookies = (res, email_verified, phone_verified, role, access_token, refresh_token) => {
    res.cookie('email_verified', email_verified, {
        httpOnly: false,
        secure: false,
    });
    res.cookie('phone_verified', phone_verified, {
        httpOnly: false,
        secure: false,
    });
    res.cookie('role', role, {
        httpOnly: false,
        secure: false,
    });
    res.cookie('access_token', access_token, {
        httpOnly: false,
        secure: false,
    });
    res.cookie('refresh_token', refresh_token, {
        httpOnly: false,
        secure: false,
    });
};
exports.default = setTokensCookies;
