// seed.js
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const EMAILS_PATH = path.join(process.cwd(), 'emails.json');
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'models/gemini-1.5-pro-001';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

// Sample topics for email generation
const topics = [
  "Weekly Project Update",
  "Team Meeting Summary",
  "Freelance Payment Reminder",
  "Internship Opportunity",
  "Bug Report Acknowledgment",
  "Holiday Schedule",
  "Upcoming Event Details",
  "Client Feedback Request",
  "New Feature Rollout",
  "Follow-up on Interview"
];

function getRandomTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

function buildGeminiPayload(prompt) {
  return {
    contents: [
      {
        parts: [{ text: prompt }],
        role: "user"
      }
    ]
  };
}

async function generateMockEmail(id, topic, retries = 3) {
  const prompt = `
Generate a professional email in **strict JSON** format like:
{
  "subject": "Subject",
  "from": "sender@example.com",
  "to": "you@example.com",
  "date": "2024-01-01T12:00:00Z",
  "body": "Actual body message"
}
Return ONLY the JSON. Topic: "${topic}"
  `.trim();

  try {
    const response = await axios.post(GEMINI_URL, buildGeminiPayload(prompt));
    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const json = JSON.parse(rawText.replace(/```json|```/g, '').trim());

    return {
      id,
      subject: json.subject,
      from: json.from,
      to: json.to || "you@example.com",
      date: new Date().toISOString(),
      body: json.body
    };

  } catch (err) {
    if (retries > 0) {
      console.warn(`⚠️ Gemini retry for email #${id} — Remaining: ${retries - 1}`);
      await new Promise(r => setTimeout(r, 1000));
      return generateMockEmail(id, topic, retries - 1);
    }

    console.error("❌ Gemini failed for:", topic, "\n", err.message);

    return {
      id,
      subject: topic + " (Fallback)",
      from: `failbot-${id}@mail.ai`,
      to: "you@example.com",
      date: new Date().toISOString(),
      body: `⚠️ Gemini could not generate content for topic: ${topic}`
    };
  }
}

export async function seedEmails(count = 10) {
  console.log("🌱 Seeding emails...");

  const emails = [];

  for (let i = 1; i <= count; i++) {
    const topic = getRandomTopic();
    const email = await generateMockEmail(i, topic);
    emails.push(email);
  }

  fs.writeFileSync(EMAILS_PATH, JSON.stringify(emails, null, 2));
  console.log(`✅ Seeded ${emails.length} emails to emails.json`);
}
