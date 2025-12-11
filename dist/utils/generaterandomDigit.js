"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandomDigit = (startWith, digit) => {
    return Math.floor(startWith + Math.random() * digit);
};
exports.default = generateRandomDigit;
