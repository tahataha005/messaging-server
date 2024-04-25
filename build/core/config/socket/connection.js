"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketConnection = void 0;
const socket_io_1 = require("socket.io");
const chat_1 = require("./events/chat");
const socketConnection = () => {
    const io = new socket_io_1.Server(8001, {
        cors: {
            origin: "*",
        },
    });
    io.on("connection", (socket) => {
        console.log(`New connection: ${socket.id}`);
        (0, chat_1.registerChatEvents)(io, socket);
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
exports.socketConnection = socketConnection;