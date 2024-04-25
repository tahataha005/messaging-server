import { Server, Socket } from "socket.io";
import { registerChatEvents } from "./events/chat";

export const socketConnection = () => {
  const io = new Server(8001, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);

    registerChatEvents(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
