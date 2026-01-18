import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are COMMANDER AI, a powerful company brain. You think like a CEO, strategist, and execution leader. Give clear, practical, business-focused answers."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.status(200).json({
      reply: response.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      error: "AI processing failed",
      details: error.message
    });
  }
}
