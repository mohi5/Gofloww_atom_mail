const API_BASE = "http://localhost:3000";
let selectedEmail = null;

// 🔁 Load emails on page load
window.onload = () => {
  fetchEmails();
};

// 📥 Fetch and display inbox emails
async function fetchEmails() {
  const container = document.getElementById("emails");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`${API_BASE}/emails`);
    const emails = await res.json();

    container.innerHTML = "";
    emails.forEach((email) => {
      const emailItem = document.createElement("div");
      emailItem.className = "email-item";
      emailItem.innerText = `${email.subject}`;
      emailItem.onclick = () => showEmail(email);
      container.appendChild(emailItem);
    });
  } catch (err) {
    container.innerHTML = "<p>⚠️ Error loading emails.</p>";
    console.error("Error fetching emails:", err);
  }
}

// 📧 Display selected email
function showEmail(email) {
  selectedEmail = email;

  const emailContent = document.getElementById("emailContent");
  emailContent.innerHTML = `
    <h3>${email.subject}</h3>
    <p><strong>From:</strong> ${email.from}</p>
    <p>${email.body}</p>
  `;

  document.getElementById("replyInput").value = "";
  document.getElementById("statusMessage").innerText = "";
}

// 🧠 Generate AI reply using Gemini API
async function generateReply() {
  if (!selectedEmail || !selectedEmail.body) {
    alert("Please select a valid email first.");
    return;
  }

  const tone = document.getElementById("tone")?.value || "neutral";
  const personality = document.getElementById("personality")?.value || "professional";
  const length = document.getElementById("length")?.value || "medium";
  const intent = document.getElementById("intent")?.value || "General response";
  const fallbackRecipient = document.getElementById("recipient")?.value || "Recipient";
  const recipient = selectedEmail.from?.trim() || fallbackRecipient;

  const status = document.getElementById("statusMessage");
  const replyInput = document.getElementById("replyInput");

  if (!status || !replyInput) {
    console.error("💥 Missing DOM elements: statusMessage or replyInput");
    return;
  }

  status.innerText = "⚙️ Generating reply using AI...";

  try {
    const payload = {
      email: selectedEmail.body,
      tone,
      personality,
      length,
      intent,
      recipient,
    };

    console.log("📤 Sending request payload:", payload);

    const res = await fetch(`${API_BASE}/generate-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ API Response:", data);

    const reply = data?.email?.trim();

    if (reply) {
      replyInput.value = reply;
      status.innerText = "✅ Reply generated successfully.";
    } else {
      replyInput.value = "";
      status.innerText = "⚠️ No reply returned by AI.";
      console.warn("⚠️ Empty reply received:", data);
    }

  } catch (err) {
    status.innerText = "❌ Failed to generate reply.";
    replyInput.value = "";
    console.error("🚨 AI Reply Generation Error:", err);
  }
}


// 🧠 Generate AI reply using Gemini API
// 🧠 Generate point-wise summary using Gemini API
// 🧠 Generate AI summary using Gemini API
async function summary() {
  if (!selectedEmail || !selectedEmail.body) {
    alert("Please select a valid email first.");
    return;
  }

  const tone = document.getElementById("tone")?.value || "neutral";
  const personality = document.getElementById("personality")?.value || "professional";
  const length = document.getElementById("length")?.value || "short";
  const intent = document.getElementById("intent")?.value || "General summary";
  const fallbackRecipient = document.getElementById("recipient")?.value || "Recipient";
  const recipient = selectedEmail.from?.trim() || fallbackRecipient;

  const status = document.getElementById("statusMessage");
  const replyInput = document.getElementById("replyInput");

  if (!status || !replyInput) {
    console.error("💥 Missing DOM elements: statusMessage or replyInput");
    return;
  }

  status.innerText = "🧠 Generating summary using AI...";

  try {
    const payload = {
      email: selectedEmail.body,
      tone,
      intent,
      length,
      recipient,
    };

    console.log("📤 Sending summary request payload:", payload);

    const res = await fetch(`${API_BASE}/generate-sum`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Summary API responded with status ${res.status}`);
    }

    const data = await res.json();
    console.log("📝 Summary API Response:", data);

    const summaryText = data?.email?.trim();

    if (summaryText) {
      replyInput.value = summaryText;
      status.innerText = "✅ Summary generated successfully.";
    } else {
      replyInput.value = "";
      status.innerText = "⚠️ No summary returned by AI.";
      console.warn("⚠️ Empty summary received:", data);
    }

  } catch (err) {
    status.innerText = "❌ Failed to generate summary.";
    replyInput.value = "";
    console.error("🚨 AI Summary Generation Error:", err);
  }
}


// 📤 Send reply (placeholder for now)
function sendReply() {
  const reply = document.getElementById("replyInput").value;
  if (!reply.trim()) {
    alert("Reply is empty!");
    return;
  }

  alert("📤 Reply sent:\n\n" + reply);
}
