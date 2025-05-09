import React, { useState, useEffect, useRef } from 'react';
import { SendHorizonal, X } from 'lucide-react';

function Chatbot() {
  const [visible, setVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("http://localhost:5050/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply || "Sorry, I didn't get that." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMsg = { sender: "bot", text: "Something went wrong. Try again later." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If not visible, render nothing
  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 w-96 bg-white p-4 shadow-2xl rounded-2xl border z-50 border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 px-1">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
          Attendify Assistant
        </h2>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-red-500 transition text-xl"
        >
          <X />
        </button>
      </div>

      {/* Chat Area */}
      <div className="h-64 overflow-y-auto border rounded-md mb-3 px-2 py-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-xl text-sm max-w-[75%] ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Ask something..."
          disabled={sending}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition flex items-center justify-center"
          disabled={sending}
        >
          <SendHorizonal size={16} />
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
