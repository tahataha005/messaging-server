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
exports.getChats = void 0;
const chat_model_1 = require("../../core/data/models/chat.model");
const helpers_1 = require("../users/helpers");
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(400).json({ error: "Token not provided" });
    }
    const token = header.split(" ")[1];
    const data = yield (0, helpers_1.verifyToken)(token);
    try {
        const chats = yield chat_model_1.Chat.find({
            users: { $in: [data.id] },
        })
            .populate({
            path: "users",
            model: "User",
        })
            .exec();
        res.status(200).json(chats);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getChats = getChats;
