# ✅ Prototype for Gofloww Atom Mail Challenge

```markdown
# 📬 GoFloww Atom Mail — AI Email Assistant (Prototype)

> 🚀 An AI-powered email assistant prototype built with HTML, CSS, JavaScript, and Node.js — featuring Gemini API for intelligent summarization and reply generation, with tone/personalization controls.
```

---

### 🧠 Features

- ✨ **Auto-generates emails** from pre-defined keywords using Gemini
- 📥 Stores generated emails via an API route for retrieval
- 🧾 Smart **summarization** of incoming emails
- ✍️ Custom **AI-generated replies** based on:
  - Tone (e.g. neutral, formal, casual)
  - Personality (e.g. professional, friendly)
  - Length (short, medium, detailed)
- 🌐 Frontend runs without a server
- 🔒 Environment-controlled Gemini API key
- 🎨 Clean UI + 💡 Subtle animations for a modern feel

---

### 📂 Project Structure

```
Proto/
│
├── .env                   # 🔐 Gemini API key (template below)
├── .gitignore             # 🚫 Node & env exclusions
├── package.json           # 📦 Node dependencies
├── package-lock.json      # 🔒 Dependency lock
│
├── server.js              # 🌐 API server for email routing & generation
├── generateMails.js       # 🧠 Email generator using Gemini + mock logic
│
├── index.html             # 🖥️ Main frontend interface
├── styles.css             # 🎨 Custom UI/UX styling
├── script.js              # 🧠 Frontend JS logic: fetch, summarize, reply
│
└── README.md              # 📘 You're reading it!
```

---

## 🛠️ Setup Instructions

#### 1. Clone the repo

```bash
git clone https://github.com/mohi5/Gofloww_atom_mail.git
cd Gofloww_atom_mail
```

#### 2. Install backend dependencies

```bash
npm install
```

#### 3. Configure `.env` file

Create a `.env` file in the root directory:

```env
# .env
GEMINI_API_KEY=your-free-gemini-api-key-here
```

#### 4. Start the backend server

```bash
node server.js
```
or you can use nodemon for auto server start of save
```bash
npm i nodemon
npx nodemon server.js
```

Your server will start at `http://localhost:3000`.

#### 5. Open the frontend

Just open `index.html` in your browser directly (no server needed).

---

### 🎥 Visuals & Animations
> 🧠 Summary Generation
> ✍️ Reply Creation 
> ⚡ Modern card-style layout with animated transitions between views  
> 🎯 Real-time status updates (`⚙️ Generating reply...`, `✅ Summary generated`, etc.)

---

### ⚙️ Customization Options
 
You can control the following options via the UI dropdowns:

- **Tone:** Neutral, Formal, Friendly
- **Personality:** Professional, Humorous, Empathetic
- **Length:** Short, Medium, Long
- **Intent:** General, Apology, Inquiry, Follow-up...

---

### 💡 Future Enhancements (Planned)

- ✨ Save replies to local storage or database
- 📤 Email sending integration
- 🔍 Search & filter emails by sender/keywords
- 🤖 Local LLM support (Mistral/LLaMA via Ollama)
- 🎛️ Settings page for user preferences

---

### 📦 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **AI Backend:** Gemini API (free version via API key)
- **Server:** Node.js + Express
- **Storage:** In-memory or mock JSON (extendable)

---

✅ You can get a free Gemini API key from: [https://makersuite.google.com/app](https://makersuite.google.com/app)

---

## Pptx for our prototype

[CLick to preview](https://docs.google.com/presentation/d/1Gs5VMMl0CRaIVYeOtCJMyWOn7YeA2xot/edit?usp=sharing&ouid=107993922139507169933&rtpof=true&sd=true)

---

### 🧑‍💻 Author

Built with 🧠 by [Mohit](https://github.com/mohi5) [Nishan](https://github.com/nishuR31) [Aman](https://github.com/Aman-kumar2006) [Akash](https://github.com/Akash-Munda)— BTech CSE, GoFloww AI Intern.

---


### 📜 License

This project is open-source under the [MIT License](LICENSE).
