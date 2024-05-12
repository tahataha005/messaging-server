import { Chat } from "../../core/data/models/chat.model";
import { Request, Response } from "express";
import { verifyToken } from "../users/helpers";
import { User } from "../../core/data/models/user.model";

export const getChats = async (req: Request, res: Response) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(400).json({ error: "Token not provided" });
  }

  const token = header.split(" ")[1];

  const data: any = await verifyToken(token);

  try {
    const chats = await Chat.find({
      users: { $in: [data.id!] },
    })
      .populate({
        path: "users",
        model: "User",
      })
      .exec();

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createChat = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  const { id }: any = await verifyToken(token!);

  const { room, ...queries } = req.body;

  const user = await User.findOne({
    $or: [{ email: queries.email }, { username: queries.username }],
  });

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const chat = await Chat.findOne({
    users: { $all: [id, user._id] },
  });

  if (chat) {
    return res.status(400).json({ error: "Chat already exists" });
  }

  const newChat = new Chat({ room, users: [id, user._id], messages: [] });

  await newChat.save();

  return res.status(201).json(chat);
};

export const readChat = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  const { id }: any = await verifyToken(token!);

  const { room } = req.params;

  const chat = await Chat.findOne({ room });

  if (!chat) {
    return res.status(400).json({ error: "Chat not found" });
  }

  const user = chat.users.find((user) => user.toString() !== id);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const messages = chat.messages.map((message) => {
    message.read = true;

    return message;
  });

  chat.messages = messages;

  await chat.save();

  return res.status(200).json(chat);
};
