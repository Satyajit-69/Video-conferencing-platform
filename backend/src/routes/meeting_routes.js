import express from "express";
import { createMeeting } from "../controllers/meetingController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyToken, createMeeting);

export default router;
