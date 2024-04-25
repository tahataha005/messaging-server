import { compare, genSalt, hash } from "bcrypt";
import { UserDocument } from "../../core/data/models/user.model";
import { sign, verify } from "jsonwebtoken";

export const hashPassword = async (password: string) => {
  const salt = await genSalt(10);

  const hashedPassword = await hash(password, salt);

  return hashedPassword;
};

export const comparePassword = async (password: string, hashed: string) => {
  const result = await compare(password, hashed);

  console.log(result);

  return result;
};

export const generateToken = async (user: UserDocument) => {
  const { _id: id, email, phone } = user;

  const token = await sign({ id, email, phone }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return token;
};

export const verifyToken = async (token: string) => {
  try {
    const check = await verify(token, process.env.JWT_SECRET!);

    return check;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
};
