// routes/vector_routes.js
import express from "express";
import { addVector, queryVector } from "../controllers/vectorController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { generateEmbedding } from "../services/embeddingService.js";

const router = express.Router();

// Existing routes (keep)
router.post("/store", verifyToken, addVector);
router.post("/search", verifyToken, queryVector);

// 🔹 TEMP: Embedding test route
router.post("/test-embedding", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const embedding = await generateEmbedding(text);

    res.json({
      success: true,
      dimensions: embedding.length,
      sample: embedding.slice(0, 5), // first 5 values only
    });
  } catch (error) {
    console.error("Embedding test error:", error);
    res.status(500).json({ error: "Embedding generation failed" });
  }
});

export default router;
