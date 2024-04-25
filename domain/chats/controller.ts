import { Chat } from "../../core/data/models/chat.model";
import { Request, Response } from "express";
import { verifyToken } from "../users/helpers";

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
