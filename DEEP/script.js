const API_BASE = "http://localhost:3000";
let selectedEmail = null;

window.onload = () => {
  fetchEmails();
};

async function fetchEmails() {
  const container = document.getElementById("emails");
  container.innerHTML = "<p>📩 Loading inbox...</p>";

  try {
    const res = await fetch(`${API_BASE}/emails`);
    const emails = await res.json();

    container.innerHTML = "";

    emails.forEach((email, index) => {
      const emailItem = document.createElement("div");
      emailItem.className = "email-item";
      emailItem.innerHTML = `
        <strong>${email.subject}</strong>
        <p>From: ${email.from}</p>
      `;
      emailItem.onclick = () => {
        // Highlight active email
        document.querySelectorAll(".email-item").forEach((el) => el.classList.remove("selected"));
        emailItem.classList.add("selected");
        showEmail(email);
      };
      container.appendChild(emailItem);
    });
  } catch (err) {
    container.innerHTML = "<p>⚠️ Error loading emails.</p>";
    console.error("Error fetching emails:", err);
  }
}

function showEmail(email) {
  selectedEmail = email;

  const emailContent = document.getElementById("emailContent");
  emailContent.innerHTML = `
    <h3>${email.subject}</h3>
    <p><strong>From:</strong> ${email.from}</p>
    <p>${email.body}</p>
    <button id="summarizeBtn" onclick="summary()">🧠 Summarize</button>
  `;

  document.getElementById("replyInput").value = "";
  document.getElementById("statusMessage").innerText = "";
}

async function summary() {
  if (!selectedEmail?.body) return alert("Select an email first.");

  const payload = buildPayload("summary");
  console.log("📨 Sending summary payload:", payload);

  const status = document.getElementById("statusMessage");
  const replyInput = document.getElementById("replyInput");

  status.innerText = "🧠 Generating summary...";
  replyInput.value = "";
  disableButton("summarizeBtn");

  try {
    const res = await fetch(`${API_BASE}/sum`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);

    const data = await res.json();
    const summary = data?.summary?.trim();

    if (summary) {
      replyInput.value = summary;
      status.innerText = "✅ Summary generated.";
      unlockReplyButton(); // enable reply button
    } else {
      status.innerText = "⚠️ No summary returned.";
    }
  } catch (err) {
    console.error("Summary error:", err);
    status.innerText = "❌ Failed to generate summary.";
  }

  enableButton("summarizeBtn");
}




//---------------------------------------





async function generateReply() {
  if (!selectedEmail?.body) return alert("Select an email first.");

  const payload = buildPayload("reply");
  console.log("✍️ Sending reply payload:", payload);

  const status = document.getElementById("statusMessage");
  const replyInput = document.getElementById("replyInput");

  status.innerText = "✍️ Generating reply...";
  replyInput.value = "";
  disableButton("generateReplyBtn");

  try {
    const res = await fetch(`${API_BASE}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);

    const data = await res.json();
    const reply = data?.email?.trim();

    if (reply) {
      replyInput.value = reply;
      status.innerText = "✅ Reply generated.";
    } else {
      status.innerText = "⚠️ No reply generated.";
    }
  } catch (err) {
    console.error("Reply error:", err);
    status.innerText = "❌ Failed to generate reply.";
  }

  enableButton("generateReplyBtn");
}

function sendReply() {
  const reply = document.getElementById("replyInput").value.trim();
  if (!reply) return alert("Reply is empty!");
  alert("📤 Reply sent:\n\n" + reply);
}

function buildPayload(type = "summary") {
  const tone = document.getElementById("tone")?.value || "neutral";
  const personality = document.getElementById("personality")?.value || "professional";
  const length = document.getElementById("length")?.value || (type === "summary" ? "short" : "medium");
  const intent = document.getElementById("intent")?.value || "General";
  const recipientInput = document.getElementById("recipient")?.value || "Recipient";
  const recipient = selectedEmail.from?.trim() || recipientInput;

  return {
    email: selectedEmail,
    tone,
    personality,
    length,
    intent,
    recipient
  };
}

function unlockReplyButton() {
  const existing = document.getElementById("generateReplyBtn");
  if (existing) return;

  const btn = document.createElement("button");
  btn.id = "generateReplyBtn";
  btn.innerText = "✍️ Generate AI Reply";
  btn.onclick = generateReply;
  document.getElementById("emailContent").appendChild(btn);
}

// 🔧 Utility: disable/enable buttons
function disableButton(id) {
  const btn = document.getElementById(id);
  if (btn) btn.disabled = true;
}
function enableButton(id) {
  const btn = document.getElementById(id);
  if (btn) btn.disabled = false;
}
