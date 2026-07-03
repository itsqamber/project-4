import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

const allowedTones = ["professional", "funny", "friendly", "inspirational", "bold"];
const allowedPlatforms = ["LinkedIn", "Instagram", "X", "Facebook", "TikTok"];

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function buildPrompt({ topic, tone, platform }) {
  return [
    `Write one catchy ${platform} social media post about: "${topic}".`,
    `Tone: ${tone}.`,
    "Make it practical, original, and platform-appropriate.",
    "Include a strong hook, 1-2 short body paragraphs, a clear call to action, and 4-7 relevant hashtags.",
    "Return only the finished post text."
  ].join("\n");
}

function extractOpenAIText(data) {
  if (data.output_text) {
    return data.output_text.trim();
  }

  const text = data.output
    ?.flatMap((item) => item.content || [])
    ?.filter((content) => content.type === "output_text")
    ?.map((content) => content.text)
    ?.join("\n")
    ?.trim();

  return text || "";
}

function extractGeminiText(data) {
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      ?.join("")
      ?.trim() || ""
  );
}

async function generateWithOpenAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: prompt,
      temperature: 0.8,
      max_output_tokens: 450
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI request failed.");
  }

  const post = extractOpenAIText(data);

  if (!post) {
    throw new Error("OpenAI returned an empty post.");
  }

  return post;
}

async function generateWithGemini(prompt) {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 450
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini request failed.");
  }

  const post = extractGeminiText(data);

  if (!post) {
    throw new Error("Gemini returned an empty post.");
  }

  return post;
}

app.post("/api/generate-post", async (req, res) => {
  try {
    const topic = String(req.body.topic || "").trim();
    const tone = String(req.body.tone || "").trim().toLowerCase();
    const platform = String(req.body.platform || "").trim();

    if (!process.env.API_KEY) {
      return res.status(500).json({ error: "Missing API_KEY environment variable." });
    }

    if (!topic) {
      return res.status(400).json({ error: "Topic is required." });
    }

    if (topic.length > 180) {
      return res.status(400).json({ error: "Topic must be 180 characters or fewer." });
    }

    if (!allowedTones.includes(tone)) {
      return res.status(400).json({ error: "Invalid tone selected." });
    }

    if (!allowedPlatforms.includes(platform)) {
      return res.status(400).json({ error: "Invalid platform selected." });
    }

    const prompt = buildPrompt({ topic, tone, platform });
    const post = provider === "gemini" ? await generateWithGemini(prompt) : await generateWithOpenAI(prompt);

    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Unable to generate post." });
  }
});

app.listen(PORT, () => {
  console.log(`AI Micro-Tools API running on http://localhost:${PORT}`);
});
