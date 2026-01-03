import express from "express";
import { chatAssistant } from "../controllers/assistantController.js";
// import {verifyToken} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/chat", chatAssistant);

export default router;
