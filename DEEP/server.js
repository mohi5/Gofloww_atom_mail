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
// const DEEPSEEK_URL = "https://api.deepseek.com/v1";

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
    const { email, intent = "summarize professionally", tone = "neutral", length = "short", recipient = "user" } = req.body;
    const body = email?.body || "";
  
    if (!email || !body) {
      return res.status(400).json({ error: "Missing email body" });
    }
  
    const prompt = `
  You are a professional AI assistant trained to summarize business and personal emails.
  
  📨 Email Content:
  """ 
  ${body}
  """
  
  📌 Summary Instructions:
  - Write a concise and informative summary in ${length} length and a ${tone} tone.
  - Intended recipient: ${recipient}
  - Intent: ${intent}
  
  ✏️ Formatting Guidelines:
  - Use bullet points for clarity **only if multiple ideas exist**.
  - Keep the summary factual — do not assume or invent details.
  - Do NOT add commentary, opinions, or sign-offs.
  
  Return only the summary content. Nothing more.
  `;
  
    try {
      const summary = await callDeepSeek(prompt);
  
      if (!summary) {
        throw new Error("Empty or invalid summary received from model.");
      }
  
      console.log("🧠 Raw summary response:", summary);
      const cleanSummary = summary.replace(/^\\boxed{/, "").replace(/}$/, "").trim();
      res.json({ summary: cleanSummary });

    } catch (err) {
      console.error("❌ Summary error:", err.message || err);
      res.status(500).json({ error: "Failed to summarize email" });
    }
  });
  



// 💬 /reply – Custom Email Writer
app.post("/reply", async (req, res) => {
  try {
    const { intent, tone, length, recipient, personality = "neutral" } = req.body;

    if (!intent || !tone || !length || !recipient) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `
    You are an expert email assistant writing on behalf of a busy professional.
    
    ✍️ Task:
    Compose an email based on the following inputs.
    
    🧾 Details:
    - Length: ${length}
    - Tone: ${tone}
    - Personality Style: ${personality}
    - Recipient: ${recipient}
    - Core Intent/Topic: "${intent}"
    
    📌 Instructions:
    - Write the full email — include greetings and sign-offs like they are absolutely necessary.
    - Ensure the content flows naturally and remains relevant to the intent.
    - Avoid fluff, clichés, or made-up facts.
    - Reflect the chosen tone and personality in language choice and structure.
    
    Generate the full mail. Be precise, professional, and human-like.
    `;
    
    const reply = await callDeepSeek(prompt);
    let cleanedReply= reply.replace(/^\\boxed{/, "").replace(/}$/, "").trim();

    console.log(reply);

    res.json({
      email: cleanedReply,
      meta: { intent, tone, length, recipient, personality },
      model: "deepseek/deepseek-r1-zero:free",
      time: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate custom email" });
  }
});


// // 💬 /reply – Custom Email Writer
// app.post("/reply", async (req, res) => {
//   try {
//     const { intent, tone, length, recipient, personality = "neutral" } = req.body;

//     if (!intent || !tone || !length || !recipient) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const prompt = `
//     You are an expert email assistant writing on behalf of a busy professional.
    
//     ✍️ Task:
//     Compose an email based on the following inputs.
    
//     🧾 Details:
//     - Length: ${length}
//     - Tone: ${tone}
//     - Personality Style: ${personality}
//     - Recipient: ${recipient}
//     - Core Intent/Topic: "${intent}"
    
//     📌 Instructions:
//     - Write the full email — include greetings and sign-offs like they are absolutely necessary.
//     - Ensure the content flows naturally and remains relevant to the intent.
//     - Avoid fluff, clichés, or made-up facts.
//     - Reflect the chosen tone and personality in language choice and structure.
    
//     Generate the full mail. Be precise, professional, and human-like.
//     `;
    
//     const reply = await callDeepSeek(prompt);
//     console.log(reply);

//     res.json({
//       email: reply.trim(),
//       meta: { intent, tone, length, recipient, personality },
//       model: "deepseek/deepseek-r1-zero:free",
//       time: new Date().toISOString()
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to generate custom email" });
//   }
// });
// 💬 /reply – Custom Email Writer
app.post("/reply", async (req, res) => {
  try {
    const { intent, tone, length, recipient, personality = "neutral" } = req.body;

    if (!intent || !tone || !length || !recipient) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `
    You are an expert email assistant writing on behalf of a busy professional.
    
    ✍️ Task:
    Compose an email based on the following inputs.
    
    🧾 Details:
    - Length: ${length}
    - Tone: ${tone}
    - Personality Style: ${personality}
    - Recipient: ${recipient}
    - Core Intent/Topic: "${intent}"
    
    📌 Instructions:
    - Write the full email — include greetings and sign-offs like they are absolutely necessary.
    - Ensure the content flows naturally and remains relevant to the intent.
    - Avoid fluff, clichés, or made-up facts.
    - Reflect the chosen tone and personality in language choice and structure.
    
    Generate the full mail. Be precise, professional, and human-like.
    `;
    
    const reply = await callDeepSeek(prompt);
    console.log(reply);

    res.json({
      email: reply.trim(),
      meta: { intent, tone, length, recipient, personality },
      model: "deepseek/deepseek-r1-zero:free",
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
  newEmail.timestamp = new Date().toLocaleString();
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
  res.send(`<h1>💌 AI Email Assistant (DeepSeek)</h1><ul><li><a href="/emails">/emails</a></li><li><a href="/test">/test</a></li><li><a href="http://127.0.0.1:5500/Gofloww_atom_mail/DEEP/index.html">http://127.0.0.1:5500/Gofloww_atom_mail/DEEP/index.html</a></li></ul>`);
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
