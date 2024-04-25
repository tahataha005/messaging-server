import { model } from "mongoose";
import { chatSchema } from "../schemas/chat.schema";

export const Chat = model("Chat", chatSchema);
