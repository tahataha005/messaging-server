import { Router } from "express";
import { getChats, createChat, readChat } from "./controller";

const router = Router();

router.get("/", getChats);
router.get("/:room", readChat);
router.post("/", createChat);

export default router;
