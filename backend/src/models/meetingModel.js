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
    },
    meetingTitle: String,
    meetingPurpose: String,
    duration: String,
    isPublic: Boolean,
    password: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);
export { Meeting };
