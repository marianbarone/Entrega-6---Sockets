import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth-controller.js";

const router = Router();

router.get("/", authController.getLogin);
router.post("/", passport.authenticate("login", { failureRedirect: "/login/error" }), authController.postLogin);

router.get("/error", (req, res) => res.render("error.ejs", { error: "Invalid credentials" }));

export default router;