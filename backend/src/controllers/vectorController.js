// controllers/vectorController.js
import { storeVector, searchVector } from "../services/vectorStore.js";

/**
 * Store any text into vector DB
 * Used for: transcripts, summaries, chats
 */
export const addVector = async (req, res) => {
  try {
    const { text, metadata } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    await storeVector({ text, metadata });

    res.status(201).json({
      success: true,
      message: "Vector stored successfully",
    });
  } catch (error) {
    console.error("Vector store error:", error);
    res.status(500).json({ error: "Failed to store vector" });
  }
};

/**
 * Search similar vectors
 */
export const queryVector = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const results = await searchVector(query);

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Vector search error:", error);
    res.status(500).json({ error: "Vector search failed" });
  }
};
