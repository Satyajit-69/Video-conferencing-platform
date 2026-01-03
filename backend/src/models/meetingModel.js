import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meetingCode: {
      type: String,
      required: true,
      unique: true,
    },
    meetingTitle: {
      type: String,
      required: true,
    },
    meetingPurpose: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
