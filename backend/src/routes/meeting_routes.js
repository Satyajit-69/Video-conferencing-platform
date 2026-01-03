import express from "express";
import {
  createMeeting,
  getUserMeetings,
  getMeetingByCode,
  completeMeeting,
} from "../controllers/meetingController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ---------------------------------------
 * CREATE MEETING
 * POST /api/meetings/create
 * Protected
 * ---------------------------------------
 */
router.post("/create", verifyToken, createMeeting);

/**
 * ---------------------------------------
 * GET LOGGED-IN USER MEETINGS (Dashboard)
 * GET /api/meetings/my
 * Protected
 * ---------------------------------------
 */
router.get("/my", verifyToken, getUserMeetings);

/**
 * ---------------------------------------
 * GET MEETING BY CODE (Join Meeting)
 * GET /api/meetings/:meetingCode
 * Public
 * ---------------------------------------
 */
router.get("/:meetingCode", getMeetingByCode);

/**
 * ---------------------------------------
 * MARK MEETING AS COMPLETED (Optional)
 * PATCH /api/meetings/:meetingCode/complete
 * Protected
 * ---------------------------------------
 */
router.patch("/:meetingCode/complete", verifyToken, completeMeeting);

export default router;
