import { generateEmbedding } from "./embeddingService.js";

const vectorDB = []; // temp in-memory (replace with Chroma client)

export const storeVector = async ({ text, metadata }) => {
  const embedding = await generateEmbedding(text);

  vectorDB.push({
    embedding,
    text,
    metadata,
  });
};

export const searchVector = async (query) => {
  const queryEmbedding = await generateEmbedding(query);

  // naive similarity (placeholder)
  return vectorDB.slice(0, 3);
};
