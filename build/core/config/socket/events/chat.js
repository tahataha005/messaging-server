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
exports.registerChatEvents = void 0;
const chat_model_1 = require("../../../data/models/chat.model");
const helpers_1 = require("../../../../domain/users/helpers");
const registerChatEvents = (io, socket) => {
    socket.on("send-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data);
        const { id } = yield (0, helpers_1.verifyToken)(data.token);
        const message = {
            user: id,
            message: data.message,
            createdAt: Date.now().toString(),
        };
        socket.to(data.to).emit("message", Object.assign(Object.assign({}, data), message));
    }));
    socket.on("my-chats", ({ tunnel }) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(tunnel);
        console.log(`User joined room of tunnel ${tunnel}`);
    }));
    socket.on("join-room", ({ room, token }) => __awaiter(void 0, void 0, void 0, function* () {
        const chat = yield chat_model_1.Chat.findOne({ room });
        if (!chat) {
            const newChat = new chat_model_1.Chat({ room });
            const data = yield (0, helpers_1.verifyToken)(token);
            newChat.users.push(data.id);
            yield newChat.save();
        }
        else {
            console.log(token);
            const { id } = yield (0, helpers_1.verifyToken)(token);
            const check = chat.users.find((user) => {
                console.log(user, id);
                return user == id;
            });
            if (!check) {
                chat.users.push(id);
                yield chat.save();
            }
        }
        socket.join(room);
        io.to(room).emit("room-created", room);
    }));
    socket.on("leave-room", (room) => {
        socket.leave(room);
        io.to(room).emit("room-left", room);
    });
    socket.on("send-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { room } = data;
        const { id } = yield (0, helpers_1.verifyToken)(data.token);
        const message = {
            user: id,
            message: data.message,
            createdAt: Date.now().toString(),
        };
        const chat = yield chat_model_1.Chat.findOne({ room });
        chat === null || chat === void 0 ? void 0 : chat.messages.push(message);
        yield (chat === null || chat === void 0 ? void 0 : chat.save());
        io.to(data.room).emit("message", message);
        console.log(`Message sent to room ${data.room}: ${data.message}`);
    }));
};
exports.registerChatEvents = registerChatEvents;
