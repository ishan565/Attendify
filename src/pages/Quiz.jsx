
import React, { useState } from "react";
import axios from "axios";

function Quiz() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
  if (!topic.trim()) return;
  setLoading(true);

  try {
    const response = await axios.post(
      "https://repobackend-nd48.onrender.com",
      { topic }
    );
    setQuiz(response.data.quiz);
  } catch (error) {
    console.error("Error generating quiz:", error);
    setQuiz("Failed to generate quiz. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white flex flex-col items-center justify-start px-6 py-12">
      <h1 className="text-4xl font-mono font-bold mb-6">AI-Powered Quiz Generator 🧠</h1>

      <input
        type="text"
        placeholder="e.g. Computer Networks, DBMS, OOPs..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full max-w-md px-4 py-3 text-white font-mono rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
      />

      <button
        onClick={generateQuiz}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 active:scale-95 transition transform px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      <div className="mt-8 w-full max-w-2xl bg-gray-800 rounded-xl p-6 whitespace-pre-wrap shadow-lg border border-gray-700">
        {quiz ? (
          <pre className="text-sm font-mono">{quiz}</pre>
        ) : (
          <p className="text-gray-400">
            No quiz yet. Enter a topic and click generate.
          </p>
        )}
      </div>
    </div>
  );
}

export default Quiz;
