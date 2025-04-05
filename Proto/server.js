const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory email store
let mails = [];

// Middleware
app.use(cors());
app.use(express.json());

// Gemini Config
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env file. Server shutting down.");
  process.exit(1);
}

const GEMINI_MODEL = 'models/gemini-1.5-pro-001';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

// Utility Functions
function buildGeminiPayload(prompt, temperature = 0.6) {
  return {
    contents: [{ parts: [{ text: prompt }], role: "user" }],
    generationConfig: { temperature, topP: 1, topK: 40 }
  };
}

function getRandomTopic() {
  const topics = [
    "Meeting Schedule", "Project Update", "Invoice Reminder",
    "Partnership Opportunity", "Feedback Request", "Event Invitation"
  ];
  return topics[Math.floor(Math.random() * topics.length)];
}

// Generate Smart Email using Gemini API
async function generateSmartEmail(id, topic = "", retries = 3) {
  const chosenTopic = topic || getRandomTopic();

  const prompt = `
Write a professional email in **strict JSON** format:

{
  "subject": "Subject here",
  "from": "sender@example.com",
  "to": "receiver@example.com",
  "date": "2024-01-01T12:00:00Z",
  "body": "Actual message body here"
}

Only return the raw JSON. Topic: "${chosenTopic}"
  `;

  try {
    const response = await axios.post(GEMINI_URL, buildGeminiPayload(prompt));
    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const json = JSON.parse(rawText.replace(/```json|```/g, '').trim());

    const email = {
      id,
      subject: json.subject,
      from: json.from,
      to: json.to || "you@example.com",
      date: new Date().toISOString(),
      body: json.body
    };

    mails.push(email);
    return email;

  } catch (err) {
    if (retries > 0) {
      const wait = 1000 * (3 - retries);
      console.warn(`⚠️ Retry #${3 - retries + 1} in ${wait}ms...`);
      await new Promise(res => setTimeout(res, wait));
      return generateSmartEmail(id, topic, retries - 1);
    }

    const fallback = {
      id,
      subject: `${chosenTopic} (Fallback)`,
      from: `failbot-${id}@mail.ai`,
      to: "you@example.com",
      date: new Date().toISOString(),
      body: `⚠️ Could not generate email. Error: ${err.response?.data?.error?.message || err.message}`
    };

    console.error("❌ Final Gemini failure:", err.response?.data || err.message);
    mails.push(fallback);
    return fallback;
  }
}

// ROUTES

// GET /generate — auto topic email
app.get('/generate', async (req, res) => {
  const id = mails.length + 1;
  try {
    const email = await generateSmartEmail(id);
    res.json(email);
  } catch (err) {
    console.error("❌ /generate error:", err.message);
    res.status(500).json({ error: "Failed to generate email." });
  }
});

app.post('/generate-sum', async (req, res) => {
  try{
    const { email, intent, tone, length, recipient } = req.body;

  if (!email || !intent || !tone || !length || !recipient) {
    return res.status(400).json({
      error: "Missing required fields: intent, tone, length, recipient"
    });
  }


  const prompt = `
Write a short point wise summary having info of ${tone}, ${length},  ${recipient} ,${intent}, ${recipient}.
Do NOT include greetings or sign-offs unless necessary.
  `;

  console.log("📨 Prompt being sent to Gemini:\n", prompt);
    const response = await axios.post(GEMINI_URL, buildGeminiPayload(prompt));
    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No content.";

    res.json({
      email: rawText.trim(),
      meta: { intent, tone, length, recipient },
      model: GEMINI_MODEL,
      time: new Date().toISOString()
    });

  } catch (err) {
    console.error("❌ /generate-email error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to generate custom email. Check Gemini config or prompt."
    });
  }
});


// POST /generate-email — custom email
app.post('/generate-email', async (req, res) => {
  try{
    const { email, intent, tone, length, recipient } = req.body;

  if (!email || !intent || !tone || !length || !recipient) {
    return res.status(400).json({
      error: "Missing required fields: intent, tone, length, recipient"
    });
  }


  const prompt = `
Write a ${tone}, ${length}-length professional email to ${recipient} about: "${intent}".
Do NOT include greetings or sign-offs unless necessary.
Return ONLY the body of the email.
  `;

  console.log("📨 Prompt being sent to Gemini:\n", prompt);
    const response = await axios.post(GEMINI_URL, buildGeminiPayload(prompt));
    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No content.";

    res.json({
      email: rawText.trim(),
      meta: { intent, tone, length, recipient },
      model: GEMINI_MODEL,
      time: new Date().toISOString()
    });

  } catch (err) {
    console.error("❌ /generate-email error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to generate custom email. Check Gemini config or prompt."
    });
  }
});

// GET /emails — retrieve stored mails
app.get('/emails', (req, res) => {
  res.json(mails);
});

// Launch
app.listen(PORT, () => {
  console.log(`🚀 Server running @ http://localhost:${PORT}`);
});
