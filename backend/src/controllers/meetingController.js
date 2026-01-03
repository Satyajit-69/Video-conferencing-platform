import { Meeting } from "../models/meetingModel.js";

/**
 * ---------------------------------------
 * CREATE MEETING
 * ---------------------------------------
 * POST /api/meetings/create
 * Protected (JWT)
 */
export const createMeeting = async (req, res) => {
  try {
    const {
      meetingTitle,
      meetingPurpose,
      duration,
      isPublic,
      password,
      scheduledAt,
    } = req.body;

    if (!meetingTitle || !meetingPurpose || !duration) {
      return res.status(400).json({
        success: false,
        message: "Missing required meeting details",
      });
    }

    const meetingCode = Math.random().toString(36).substring(2, 10);

    const meeting = await Meeting.create({
      user_id: req.user._id, // from verifyToken
      meetingCode,
      meetingTitle,
      meetingPurpose,
      duration,
      isPublic,
      password: isPublic ? null : password,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(), // Use provided date or current date
    });

    res.status(201).json({
      success: true,
      meetingCode,
      meeting,
    });
  } catch (error) {
    console.error("Create meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create meeting",
    });
  }
};

/**
 * ---------------------------------------
 * GET ALL MEETINGS OF LOGGED-IN USER
 * ---------------------------------------
 * GET /api/meetings/my
 * Protected (JWT)
 */
export const getUserMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      user_id: req.user._id,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    console.error("Fetch meetings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
    });
  }
};

/**
 * ---------------------------------------
 * GET SINGLE MEETING BY CODE
 * ---------------------------------------
 * GET /api/meetings/:meetingCode
 * Public (used when joining)
 */
export const getMeetingByCode = async (req, res) => {
  try {
    const { meetingCode } = req.params;

    const meeting = await Meeting.findOne({ meetingCode });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error("Get meeting by code error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meeting",
    });
  }
};

/**
 * ---------------------------------------
 * MARK MEETING AS COMPLETED (OPTIONAL)
 * ---------------------------------------
 * PATCH /api/meetings/:meetingCode/complete
 * Protected (JWT)
 */
export const completeMeeting = async (req, res) => {
  try {
    const { meetingCode } = req.params;

    const meeting = await Meeting.findOne({
      meetingCode,
      user_id: req.user._id,
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found or unauthorized",
      });
    }

    meeting.date = new Date(); // update end time
    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting marked as completed",
    });
  } catch (error) {
    console.error("Complete meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete meeting",
    });
  }
};
