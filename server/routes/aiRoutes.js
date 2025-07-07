import express from "express";
import { getAIAdvice } from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, getAIAdvice);

export default router;
