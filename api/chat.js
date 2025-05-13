// chat.js (API route)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

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

  return res.status(200).json({ reply });
}
