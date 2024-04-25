import { Server, Socket } from "socket.io";
import { registerChatEvents } from "./events/chat";

export const socketConnection = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  console.log(io);

  io.on("connection", (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);

    registerChatEvents(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
