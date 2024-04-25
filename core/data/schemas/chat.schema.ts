import { Schema, Types } from "mongoose";

export const chatSchema = new Schema({
  room: {
    type: String,
    required: true,
    unique: true,
  },
  users: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      user: {
        type: Types.ObjectId,
        ref: "User",
      },
      message: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
