import { storeVector, searchVector } from "../services/vectorStore.js";

export const chatWithAssistant = async (req, res) => {
  try {
    const { message, context } = req.body;

    // 1️⃣ Search similar past context
    const similarContext = await searchVector(message);

    // 2️⃣ Generate reply (mock for now)
    const reply = `I found ${similarContext.length} related discussions for your query.`;

    // 3️⃣ Store new interaction
    await storeVector({
      text: message,
      metadata: {
        user: context?.user,
        page: context?.page,
        type: "assistant-query",
      },
    });

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Assistant failed" });
  }
};
