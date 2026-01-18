import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    // ✅ GET request - simple health check
    if (req.method === "GET") {
      return res.status(200).json({
        status: "Commander AI is LIVE 🚀",
        message: "Use POST request with JSON body { message: 'your message' }",
      });
    }

    // ✅ POST request - AI response
    if (req.method === "POST") {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Commander AI, company brain assistant." },
          { role: "user", content: message }
        ],
        temperature: 0.7,
      });

      const aiReply = response.choices[0].message.content;

      return res.status(200).json({ reply: aiReply });
    }

    // ❌ Other methods
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
