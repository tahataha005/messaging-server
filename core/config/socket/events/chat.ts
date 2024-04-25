import { Server, Socket } from "socket.io";
import { Chat } from "../../../data/models/chat.model";
import { verifyToken } from "../../../../domain/users/helpers";

export const registerChatEvents = (io: Server, socket: Socket) => {
  io.on(
    "send-message",
    async (data: {
      message: string;
      room: string;
      to: string;
      token: string;
    }) => {
      console.log(data);

      const { id }: any = await verifyToken(data.token);

      const message = {
        user: id,
        message: data.message,
        createdAt: Date.now().toString(),
      };

      socket.to(data.to).emit("message", { ...data, ...message });
    }
  );

  socket.on("my-chats", async ({ tunnel }) => {
    socket.join(tunnel);

    console.log(`User joined room of tunnel ${tunnel}`);
  });

  socket.on("join-room", async ({ room, token }) => {
    const chat = await Chat.findOne({ room });

    if (!chat) {
      const newChat = new Chat({ room });
      const data: any = await verifyToken(token);

      newChat.users.push(data.id);

      await newChat.save();
    } else {
      console.log(token);
      const { id }: any = await verifyToken(token);

      const check = chat.users.find((user) => {
        console.log(user, id);

        return user == id;
      });

      if (!check) {
        chat.users.push(id);

        await chat.save();
      }
    }

    socket.join(room);

    io.to(room).emit("room-created", room);
  });

  socket.on("leave-room", (room: string) => {
    socket.leave(room);
    io.to(room).emit("room-left", room);
  });

  socket.on(
    "send-message",
    async (data: {
      room: string;
      message: string;
      token: string;
      to: string;
    }) => {
      const { room } = data;

      const { id }: any = await verifyToken(data.token);

      const message = {
        user: id,
        message: data.message,
        createdAt: Date.now().toString(),
      };

      const chat = await Chat.findOne({ room });

      chat?.messages.push(message);

      await chat?.save();

      io.to(data.room).emit("message", { ...message, room });
      console.log(`Message sent to room ${data.room}: ${data.message}`);
    }
  );
};
