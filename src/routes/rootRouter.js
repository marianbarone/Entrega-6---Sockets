import { Router } from "express";
import authController from "../controllers/auth-controller.js";

const router = Router();

//Middleware de autenticacion.
const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    next();
};

router.get("/", authMiddleware, authController.getRoot);

export default router;