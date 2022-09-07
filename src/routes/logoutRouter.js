import { Router } from "express";
import authController from "../controllers/auth-controller.js";

const router = Router();

router.get("/", authController.getLogout);

export default router;