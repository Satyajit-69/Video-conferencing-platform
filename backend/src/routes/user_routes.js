import { Router } from "express";
import {
  registerUser,
  loginUser,
  addToActivity,
  getAllActivity
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROTECTED ROUTES (require JWT)
router.post("/add_to_activity", verifyToken, addToActivity);
router.get("/get_all_activity", verifyToken, getAllActivity);

export default router;
