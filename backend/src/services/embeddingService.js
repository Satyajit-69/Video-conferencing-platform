import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateEmbedding = async (text) => {
  try {
    if (!text) {
      throw new Error("Text is required for embedding");
    }

    // ✅ Initialize AFTER dotenv has loaded
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });

    const result = await model.embedContent(text);
    return result.embedding.values;

  } catch (error) {
    console.error("Embedding Error:", error);
    throw new Error("Failed to generate embedding");
  }
};
