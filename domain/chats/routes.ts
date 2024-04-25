import { Router } from "express";
import { getChats } from "./controller";

const router = Router();

router.get("/", getChats);

export default router;
