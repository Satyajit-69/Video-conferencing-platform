import Message from "../models/message.js";

export const getChatHistory = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    const messages = await Message
      .find({ roomId })
      .sort({ timestamp: 1 });

    return res.status(200).json({
      success: true,
      total: messages.length,
      messages,
    });

  } catch (error) {
    console.log("Chat History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
    });
  }
};
