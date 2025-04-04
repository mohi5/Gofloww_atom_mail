# AI Email Assistant

## **Project Description**
This AI-powered email assistant fetches emails from Gmail, processes them using Google's **Gemini API**, and generates smart replies. It helps users save time by automating responses while ensuring privacy and efficiency.

---

## **Problem Statement**
Managing emails manually can be time-consuming and inefficient. The need to draft context-aware replies for frequent emails increases workload and response time. This project aims to solve these problems by:

- **Automatically fetching emails** from Gmail.
- **Generating AI-based smart replies** using Gemini API.
- **Enhancing efficiency & reducing response time** with automation.
- **Ensuring privacy & security** by storing emails locally in SQLite.

---

## **How It Works (Step-by-Step)**

1. **User grants OAuth 2.0 permission** to access their Gmail inbox securely.
2. **Flask backend fetches unread emails** using the Gmail API.
3. **AI processes email content** and generates context-aware replies via Gemini API.
4. **Replies are stored in a local database (SQLite)** for future reference.
5. **User reviews and sends AI-generated replies** directly from the assistant.

---

## **Tech Stack**
- **Backend**: Python (Flask), Gmail API, Gemini API
- **Database**: SQLite (local storage for emails & responses)
- **AI Model**: Gemini Pro API (Free)
- **Authentication**: OAuth 2.0 (for Gmail access)
- **Frontend (Optional)**: React (if UI is needed)

---

## **Installation & Setup**

### **1. Clone the Repository**
```bash
git clone https://github.com/mohi5/Goflow_atom_mail.git
cd Goflow_atom_mail
```

### **2. Install Dependencies**
```bash
pip install flask requests google-auth google-auth-oauthlib google-auth-httplib2
```

### **3. Setup Google OAuth for Gmail API**
- Visit **Google Cloud Console** and enable the Gmail API.
- Download the **credentials.json** file and place it in the project folder.

### **4. Run the Flask Server**
```bash
python app.py
```

---

## **API Endpoints & Usage**

### **1. Fetch Emails**
**Endpoint:** `GET /fetch-emails`
- Fetches latest unread emails from Gmail.
- Returns a JSON list with sender, subject, and body.

```json
[
  {
    "sender": "example@gmail.com",
    "subject": "Meeting Reminder",
    "body": "Don't forget our meeting at 3 PM."
  }
]
```

### **2. Generate AI Response**
**Endpoint:** `POST /generate-response`
- Sends an email body to Gemini API for response generation.
- Returns an AI-generated reply.

#### **Request Body:**
```json
{
  "body": "Can we reschedule the meeting?"
}
```

#### **Response:**
```json
{
  "response": "Sure! What time works best for you?"
}
```

---

## **How to Extend the Project**
- **Auto-send replies** after AI generation.
- **Integrate a UI** with React for better email management.
- **Add priority detection** to categorize emails.
- **Use Llama 3 for local AI processing** (instead of external APIs).

---

## **Conclusion**
This project is a privacy-focused, open-source AI assistant that automates email replies efficiently. It integrates seamlessly with Gmail and ensures fast, context-aware responses using **free AI tools**. 🚀
