import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      return res.status(200).json({ status: "Commander AI is LIVE via Supabase 🔥" });
    }

    if (req.method === "POST") {
      const { message } = req.body;

      if (!message) return res.status(400).json({ error: "Message required" });

      // ✅ Save user message to Supabase
      await supabase.from("messages").insert([{ message }]);

      // ✅ Call OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: "You are Commander AI." }, { role: "user", content: message }],
        temperature: 0.7,
      });

      const aiReply = response.choices[0].message.content;

      // ✅ Save AI reply to Supabase
      await supabase.from("messages").insert([{ message: aiReply, role: "ai" }]);

      return res.status(200).json({ reply: aiReply });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
