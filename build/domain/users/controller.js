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
exports.getCurrentUser = exports.login = exports.signup = void 0;
const user_model_1 = require("../../core/data/models/user.model");
const helpers_1 = require("./helpers");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, phone, password } = req.body;
        const check = yield user_model_1.User.findOne({ email });
        if (check) {
            return res.status(400).json({ error: "User already exists" });
        }
        const user = new user_model_1.User({
            email,
            firstName,
            lastName,
            phone,
            password: yield (0, helpers_1.hashPassword)(password),
            tunnel: Math.random().toString(36).substring(7),
        });
        yield user.save();
        const token = yield (0, helpers_1.generateToken)(user);
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const check = yield (0, helpers_1.comparePassword)(password, user.password);
        if (!check) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = yield (0, helpers_1.generateToken)(user);
        res.status(200).json({ user, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.login = login;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const header = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    const token = header === null || header === void 0 ? void 0 : header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { id } = yield (0, helpers_1.verifyToken)(token);
    const user = yield user_model_1.User.findById(id);
    res.status(200).json(user);
});
exports.getCurrentUser = getCurrentUser;
