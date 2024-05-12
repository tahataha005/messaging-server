import { Server, Socket } from "socket.io";
import { registerChatEvents } from "./events/chat";
import { verifyToken } from "../../../domain/users/helpers";

type OnlineUser = {
  room: string;
  id: string;
};

export let onlineUsers: OnlineUser[] = [];

export const socketConnection = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket: Socket) => {
    const token = socket.handshake.auth.token;

    const { id }: any = await verifyToken(token);

    const isOnline = onlineUsers.some((user) => user.id === id);

    if (!isOnline) {
      onlineUsers.push({ id, room: socket.id });
    }

    io.emit("online", onlineUsers);

    registerChatEvents(io, socket);

    console.log(onlineUsers);

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.id !== id);

      io.emit("online", onlineUsers);
    });
  });
};
