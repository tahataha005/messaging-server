import { User } from "../../core/data/models/user.model";
import { Request, Response } from "express";
import {
  comparePassword,
  generateToken,
  hashPassword,
  verifyToken,
} from "./helpers";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, phone, password } = req.body;

    const check = await User.findOne({ email });

    if (check) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({
      email,
      firstName,
      lastName,
      phone,
      password: await hashPassword(password),
      tunnel: Math.random().toString(36).substring(7),
    });

    await user.save();

    const token = await generateToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const check = await comparePassword(password, user.password);

    if (!check) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = await generateToken(user);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const header = req.headers?.authorization;

  const token = header?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id }: any = await verifyToken(token);

  const user = await User.findById(id);

  res.status(200).json(user);
};
