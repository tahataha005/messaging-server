import { Router } from "express";
import { getCurrentUser, login, signup, oAuthLogin } from "./controller";

const router = Router();

router.get("/", getCurrentUser);
router.post("/signup", signup);
router.post("/login", login);
router.post("/oauth", oAuthLogin);

export default router;
