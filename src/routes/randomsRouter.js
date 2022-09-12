import { Router } from "express";
import randomsController from "../controllers/randoms-controller.js"

const router = Router();

router.get("/", randomsController);

export default router;