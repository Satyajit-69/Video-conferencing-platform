import { Meeting } from "../models/meetingModel.js";

export const createMeeting = async (req, res) => {
  try {
    const {
      meetingTitle,
      meetingPurpose,
      duration,
      isPublic,
      password
    } = req.body;

    const meetingCode = Math.random().toString(36).substring(2, 10);

    const meeting = await Meeting.create({
      user_id: req.user._id,
      meetingCode,
      meetingTitle,
      meetingPurpose,
      duration,
      isPublic,
      password: isPublic ? null : password
    });

    res.status(201).json({
      success: true,
      meetingCode,
      meeting
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create meeting" });
  }
};
