export const chatAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id; // ✅ FIXED

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let convo = await Conversation.findOne({ userId });
    if (!convo) {
      convo = await Conversation.create({ userId, messages: [] });
    }

    const history = convo.messages.slice(-10);

    const prompt = history
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const finalPrompt = `
${prompt}
User: ${message}
Assistant:
`;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(finalPrompt);
    const reply = result.response.text();

    convo.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: reply }
    );

    await convo.save();

    res.json({ reply });
  } catch (error) {
    console.error("Assistant Memory Error:", error);
    res.status(500).json({ error: "Assistant failed" });
  }
};
