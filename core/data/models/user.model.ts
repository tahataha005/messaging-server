import { model, Types } from "mongoose";
import { userSchema } from "../schemas/user.schema";

export const User = model("User", userSchema);

export type UserDocument = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null | undefined;
  password: string;
};
