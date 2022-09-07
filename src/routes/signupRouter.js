import { Router } from "express";
import authController from "../controllers/auth-controller.js";

const router = Router();

router.get("/", authController.getSignup);
router.post("/", authController.postSignup);

export default router;