import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { situation } = req.body;

    if (!situation) {
      return res.status(400).json({ error: "Situation is required" });
    }

    const systemPrompt = `
You are COMMANDER AI.

Role:
You act as a combined CEO, CFO, COO, and Risk Analyst.

Your job:
- Deeply analyze business situations
- Identify financial, operational, and strategic risks
- Predict consequences if no action is taken
- Recommend clear, practical, and prioritized actions

Rules:
- Never give generic advice
- Think step-by-step internally before responding
- Always respond in this exact structure:

Risk Level:
Key Issues:
Warnings:
Recommended Actions:
Decision Priority:

Tone:
Professional, decisive, business-focused.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: situation }
      ],
      temperature: 0.4
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      commander_ai_response: reply
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
