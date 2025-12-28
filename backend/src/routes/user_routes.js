import { Router } from "express";
import {
  registerUser,
  loginUser,
  addToActivity,
  getAllActivity
} from "../controllers/userController.js";

import { getChatHistory } from "../controllers/chatController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// ------------------------
// PUBLIC ROUTES
// ------------------------
router.post("/register", registerUser);
router.post("/login", loginUser);

// ------------------------
// PROTECTED ROUTES
// ------------------------
router.post("/add_to_activity", verifyToken, addToActivity);
router.get("/get_all_activity", verifyToken, getAllActivity);

// ⭐ NEW: GET CHAT HISTORY of a room (protected)
router.get("/history/:roomId", verifyToken, getChatHistory);

export default router;
