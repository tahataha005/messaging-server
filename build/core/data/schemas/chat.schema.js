"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSchema = void 0;
const mongoose_1 = require("mongoose");
exports.chatSchema = new mongoose_1.Schema({
    room: {
        type: String,
        required: true,
        unique: true,
    },
    users: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
        },
    ],
    messages: [
        {
            user: {
                type: mongoose_1.Types.ObjectId,
                ref: "User",
            },
            message: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});
