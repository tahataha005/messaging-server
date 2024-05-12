import { Server, Socket } from "socket.io";
import { Chat } from "../../../data/models/chat.model";
import { verifyToken } from "../../../../domain/users/helpers";
import { onlineUsers } from "../connection";

export const registerChatEvents = (io: Server, socket: Socket) => {
  socket.on(
    "send-message",
    async (data: { room: string; message: string; token: string }) => {
      const { id }: any = await verifyToken(data.token);

      const { room } = data;

      const date = new Date();
      const message = {
        user: id,
        message: data.message,
        createdAt: date.toISOString(),
        read: false,
      };

      const chat = await Chat.findOne({ room });

      chat?.messages.push(message);

      await chat?.save();

      const recipient: any = chat?.users.find((user) => user.toString() !== id);

      const self = onlineUsers.find((user) => user.id === id);
      const onlineRecipient = onlineUsers.find(
        (user) => user.id === recipient.toString()
      );

      if (onlineRecipient) {
        io.to(onlineRecipient.room).emit("new-message", message);
      }

      if (self) {
        io.to(self.room).emit("new-message", message);
      }
    }
  );
};
