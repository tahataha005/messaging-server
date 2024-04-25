import { Router } from "express";
import { getCurrentUser, login, signup } from "./controller";

const router = Router();

router.get("/", getCurrentUser);
router.post("/signup", signup);
router.post("/login", login);

export default router;
