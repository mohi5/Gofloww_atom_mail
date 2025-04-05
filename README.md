         
# 📬 AI Email Assistant — GoFloww Atom Mail (Prototype) 

## 🧠 Overview
 
The **AI Email Assistant** is a lightweight prototype designed to **simulate real-time email workflows** with **AI-generated smart replies** and **summarized insights**, powered by **Google's Gemini API**. 

It demonstrates how an intelligent email agent can:
- Mimic incoming mail using contextual keywords
- Summarize emails instantly
- Generate AI-crafted replies based on user-defined **tone**, **intent**, and **personality**

No Gmail integration yet — this is a **controlled prototype** to test AI features in isolation before integrating into full production systems like Atom Mail.

---

## ⚙️ Key Highlights

- 💡 **Simulated Email Feed:** Generate mock emails based on prompts or keywords
- ✂️ **Summarization Engine:** Extracts intent & essence from lengthy emails
- ✍️ **AI Reply Generator:** Writes contextual replies with adjustable parameters
- 🎯 **Tone Personalization:** Reply in neutral, formal, friendly, or witty styles
- 🖼️ **Frontend Only Mode:** UI runs without a server — open in any browser
- 🌐 **Light Backend:** Local Node.js server handles mail simulation and routing
- 🔐 **Environment-based API Key Setup** for free Gemini API

---

## 📦 Tech Snapshot

- **Frontend:** HTML + CSS + JavaScript (Vanilla)
- **Backend:** Node.js + Express (email simulation, Gemini API routing)
- **AI Engine:** Gemini Pro (free-tier via API key)
- **No Database Yet:** In-memory mail store for simplicity

---

## 🚧 Why This Prototype?

> Building AI-first email agents requires **robust testing grounds** before integrating with live systems like Gmail.  
This prototype lays the foundation for:

- 🧪 Testing LLM accuracy in real-world-like scenarios  
- 🧠 Fine-tuning prompt engineering and reply customization  
- 🔁 Simulating continuous feedback loops (receive ➜ summarize ➜ reply)

---

## 🚀 Future Vision

This is just the start. The full product aims to:
- Connect to **real inboxes** (OAuth-based Gmail integration)
- Add **real-time notifications**
- Support **offline/local LLMs** (LLaMA 3, Mistral via Ollama)
- Offer **task extraction**, **sentiment tagging**, and **priority ranking**
- Provide a beautiful, responsive **React frontend** (already planned 🎨)

---

## 🛠️ Wanna see Prototype?
Preview Prototype: [CLick](Proto/README.md)


## 💬 Feedback & Contributions

This is a **live prototype in evolution** — open to contributors, feedback, and collaborators.

- 🔧 Fork it, build it, break it.
- 💬 Raise issues for UX, logic, or AI behavior.
- 🧠 Suggest better prompt strategies or models.

---

## 📜 License

MIT License — See [LICENSE](LICENSE) 

