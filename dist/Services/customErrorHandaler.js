"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
        Object.setPrototypeOf(this, CustomErrorHandler.prototype);
    }
    static alreadyExist(message) {
        return new CustomErrorHandler(409, message);
    }
    static wrongCredentials(message = 'Username or password is wrong!') {
        return new CustomErrorHandler(401, message);
    }
    static unAuthorized(message = 'unAuthorized') {
        return new CustomErrorHandler(403, message);
    }
    static notFound(message = '404 Not Found') {
        return new CustomErrorHandler(404, message);
    }
    static notAllowed(message = '403 Not Allowed') {
        return new CustomErrorHandler(401, message);
    }
    static invalid(message) {
        return new CustomErrorHandler(400, message);
    }
    static serverError(message = 'Internal server error') {
        return new CustomErrorHandler(500, message);
    }
    toJson() {
        return {
            status: this.status,
            message: this.message,
        };
    }
}
exports.default = CustomErrorHandler;
