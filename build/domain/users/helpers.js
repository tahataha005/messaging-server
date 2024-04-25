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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield (0, bcrypt_1.genSalt)(10);
    const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
    return hashedPassword;
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashed) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, bcrypt_1.compare)(password, hashed);
    console.log(result);
    return result;
});
exports.comparePassword = comparePassword;
const generateToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: id, email, phone } = user;
    const token = yield (0, jsonwebtoken_1.sign)({ id, email, phone }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return token;
});
exports.generateToken = generateToken;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const check = yield (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        return check;
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        return false;
    }
});
exports.verifyToken = verifyToken;
