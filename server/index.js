import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { limitDailyGenerations } from "./middleware/rateLimitUsage.js";

const app = express();
const PORT = process.env.PORT || 3001;
const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

const allowedTones = ["professional", "funny", "friendly", "inspirational", "bold"];
const allowedPlatforms = ["LinkedIn", "Instagram", "X", "Facebook", "TikTok"];

await connectDB();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function buildPostPrompt({ topic, tone, platform }) {
  return [
    `Write one catchy ${platform} social media post about: "${topic}".`,
    `Tone: ${tone}.`,
    "Make it practical, original, and platform-appropriate.",
    "Include a strong hook, 1-2 short body paragraphs, a clear call to action, and 4-7 relevant hashtags.",
    "Return only the finished post text."
  ].join("\n");
}

function buildResumePrompt({ fullName, contact, skills, experience, education }) {
  return [
    "You are an expert resume writer and career coach.",
    "Rewrite and optimize the following resume data into polished, professional, ATS-friendly resume content.",
    "Keep the candidate facts truthful. Do not invent employers, degrees, dates, or certifications.",
    "Return valid JSON only, with this exact shape:",
    "{",
    '  "fullName": "string",',
    '  "contact": "string",',
    '  "summary": "2-3 sentence professional summary",',
    '  "skills": ["skill"],',
    '  "experience": ["bullet point"],',
    '  "education": ["bullet point"]',
    "}",
    "",
    `Full Name: ${fullName}`,
    `Contact: ${contact}`,
    `Skills: ${skills.join(", ")}`,
    `Experience: ${experience}`,
    `Education: ${education}`
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

async function generateWithOpenAI(prompt, maxOutputTokens = 450) {
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
      max_output_tokens: maxOutputTokens
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

async function generateWithGemini(prompt, maxOutputTokens = 450) {
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
          maxOutputTokens
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

async function generateAIText(prompt, maxOutputTokens = 450) {
  return provider === "gemini"
    ? generateWithGemini(prompt, maxOutputTokens)
    : generateWithOpenAI(prompt, maxOutputTokens);
}

function parseJsonFromAI(text) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : cleaned);
}

function normalizeResume(resume, fallback) {
  return {
    fullName: String(resume.fullName || fallback.fullName).trim(),
    contact: String(resume.contact || fallback.contact).trim(),
    summary: String(resume.summary || "").trim(),
    skills: Array.isArray(resume.skills) ? resume.skills.map(String).filter(Boolean) : fallback.skills,
    experience: Array.isArray(resume.experience)
      ? resume.experience.map(String).filter(Boolean)
      : [String(resume.experience || fallback.experience).trim()].filter(Boolean),
    education: Array.isArray(resume.education)
      ? resume.education.map(String).filter(Boolean)
      : [String(resume.education || fallback.education).trim()].filter(Boolean)
  };
}

app.post("/api/generate-post", limitDailyGenerations("social-post-generator"), async (req, res) => {
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

    const prompt = buildPostPrompt({ topic, tone, platform });
    const post = await generateAIText(prompt, 450);

    res.json({ post, usage: req.usage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Unable to generate post." });
  }
});

app.post("/api/generate-resume", limitDailyGenerations("resume-builder"), async (req, res) => {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const contact = String(req.body.contact || "").trim();
    const skills = Array.isArray(req.body.skills)
      ? req.body.skills.map((skill) => String(skill).trim()).filter(Boolean)
      : [];
    const experience = String(req.body.experience || "").trim();
    const education = String(req.body.education || "").trim();

    if (!process.env.API_KEY) {
      return res.status(500).json({ error: "Missing API_KEY environment variable." });
    }

    if (!fullName || !contact || !skills.length || !experience || !education) {
      return res.status(400).json({ error: "Full name, contact, skills, experience, and education are required." });
    }

    if (fullName.length > 90 || contact.length > 180 || experience.length > 2000 || education.length > 1200) {
      return res.status(400).json({ error: "Resume input is too long. Please shorten the content and try again." });
    }

    if (skills.length > 20) {
      return res.status(400).json({ error: "Please provide 20 skills or fewer." });
    }

    const fallback = { fullName, contact, skills, experience, education };
    const prompt = buildResumePrompt(fallback);
    const aiText = await generateAIText(prompt, 1200);
    const resume = normalizeResume(parseJsonFromAI(aiText), fallback);

    res.json({ resume, usage: req.usage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Unable to generate resume." });
  }
});

app.listen(PORT, () => {
  console.log(`AI Micro-Tools API running on http://localhost:${PORT}`);
});
