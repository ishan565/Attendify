// index.js (or server.js)

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Chat route
app.post('/chat', (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({ reply: "No message provided." });
  }

  const lower = message.toLowerCase();
  let reply = "I'm not sure how to respond to that.";

  if (lower.includes("attendance")) {
    reply = "To check your attendance, go to Dashboard > Subject Stats.";
  } else if (lower.includes("mark")) {
    reply = "You can mark attendance from the Dashboard.";
  } else if (lower.includes("delete")) {
    reply = "You can delete subjects using the delete icon beside the pie chart.";
  } else if (lower.includes("hello") || lower.includes("hi")) {
    reply = "Hey! How can I assist you with Attendify?";
  }

  res.json({ reply });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Chatbot backend running on http://localhost:${PORT}`);
});
