import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { seedEmails } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());

// 🔑 DEEPSEEK API Setup
const API_KEY = process.env.API_KEY;
const DEEPSEEK_URL = "https://api.deepseek.com/v1";

const EMAILS_PATH = path.join(process.cwd(), 'emails.json');
let mails = [];

// ✅ Load or Seed Emails
async function autoSeedIfEmpty() {
  if (!fs.existsSync(EMAILS_PATH)) {
    console.log('📥 No email file found. Seeding...');
    await seedEmails();
  }

  const data = JSON.parse(fs.readFileSync(EMAILS_PATH));
  if (!data || data.length === 0) {
    console.log('📥 Email file empty. Seeding...');
    await seedEmails();
    mails = JSON.parse(fs.readFileSync(EMAILS_PATH));
  } else {
    mails = data;
    console.log(`📨 Loaded ${data.length} emails.`);
  }
}
await autoSeedIfEmpty();

function saveEmails() {
  try {
    fs.writeFileSync(EMAILS_PATH, JSON.stringify(mails, null, 2));
  } catch (err) {
    console.error("💾 Save failed:", err.message);
  }
}

// 🧠 DeepSeek Wrapper
export async function callDeepSeek(prompt) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`, // replace with your OpenRouter API key
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-r1-zero:free",
            messages: [
        { role: "system", content: "You are a smart and thoughtful AI email assistant for a busy professional." },
            { role: "user", content: prompt }
          ]
        })
      });
  
      const data = await response.json();
  
      if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      } else {
        console.error("No valid response from DeepSeek R1:", data);
        throw new Error("No valid response from DeepSeek R1.");
      }
  
    } catch (err) {
      console.error("DeepSeek API error:", err.message || err);
      throw new Error("Error calling DeepSeek R1.");
    }
  }
  
  

// 📩 /sum – Summarize Email
app.post("/sum", async (req, res) => {
  const { email, intent = "quick summary", tone = "neutral", length = "short", recipient = "user" } = req.body;
  const body = email?.body || "";

  if (!email || !body) {
    return res.status(400).json({ error: "Missing email body" });
  }

  const prompt = `
You are a highly intelligent AI assistant that summarizes professional emails.
Your goal is to generate a clear, concise, and useful summary of the following email:

---
✉️ Email Content:
${body}
---

📋 Instructions:
- Tone: ${tone}
- Length: ${length}
- Audience: ${recipient}
- Style: Clear, bullet-point (if needed), avoid fluff
- Avoid: Adding fake info or assumptions

Return only the summary, no extra commentary.
`;

  try {
    const summary = await callDeepSeek(prompt);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: "Failed to summarize email" });
  }
});

// 📨 /gen – Generate AI Reply
app.post("/gen", async (req, res) => {
  const {
    email = "", sender = "unknown",
    intent = "respond politely", tone = "formal",
    length = "medium", recipient = "sender"
  } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: "Invalid email" });
  }

  const prompt = `You are an AI assistant. Read the following email:\n"${email}"\n\nGenerate a reply with a ${tone} tone and ${length} length. Make it relevant to the context and directed to ${recipient}. Don't fabricate facts.`;

  try {
    const aiReply = await callDeepSeek(prompt);
    res.json({ reply: aiReply });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

// 💬 /reply – Custom Email Writer
app.post("/reply", async (req, res) => {
  try {
    const { intent, tone, length, recipient, personality = "neutral" } = req.body;

    if (!intent || !tone || !length || !recipient) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `Compose a ${length}-length email in a ${tone} tone with a ${personality} personality, intended for ${recipient}, about:\n"${intent}".\nDon't add greetings or sign-offs unless appropriate. Only return the body.`;

    const result = await callDeepSeek(prompt);

    res.json({
      email: result.trim(),
      meta: { intent, tone, length, recipient, personality },
      model: "deepseek-chat",
      time: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate custom email" });
  }
});

// ➕ /add – Add Email
app.post('/add', (req, res) => {
  const newEmail = req.body;
  if (!newEmail?.subject || !newEmail?.body) {
    return res.status(400).json({ error: "Email needs subject and body" });
  }

  newEmail.id = Date.now();
  newEmail.timestamp = new Date().toISOString();
  mails.unshift(newEmail);
  saveEmails();
  res.json({ success: true, email: newEmail });
});

// 🔍 /emails – Get All Emails
app.get('/emails', (req, res) => {
  res.json(mails);
});

// 🧪 /test – Check DeepSeek Connectivity
app.get("/test", async (req, res) => {
    try {
      const response = await callDeepSeek("Say something clever.");
      res.send("✅ DeepSeek response:\n\n" + response);
    } catch (err) {
      console.error("🔥 DeepSeek /test error:", err.message || err);
      res.status(500).send("❌ DeepSeek not working. Check console for error.");
    }
  });
  

// 🏠 Home
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<h1>💌 AI Email Assistant (DeepSeek)</h1><ul><li><a href="/emails">/emails</a></li><li><a href="/test">/test</a></li><a href="http://127.0.0.1:5500/Gofloww_atom_mail/Proto/index1.html">http://127.0.0.1:5500/Gofloww_atom_mail/Proto/index1.html</a></ul>`);
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
