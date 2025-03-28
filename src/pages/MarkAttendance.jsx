import { useState } from "react";
import { databases } from "../appwrite/appwriteConfig";
import { ID } from "appwrite";
import { useNavigate } from "react-router-dom";

function MarkAttendance() {
  const [form, setForm] = useState({
    userId: "",
    Date: "",
    status: "Present",
    remarks: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // 👈 Hook to navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await databases.createDocument(
        "67dd782e000f6230d82b", // Database ID
        "67dd784200275f2e2ed1", // Collection ID
        ID.unique(),
        form
      );

      setSuccess("Attendance marked successfully!");

      setTimeout(() => {
        navigate("/dashboard"); // 👈 Redirect to Dashboard
      }, 1000);

      setForm({
        userId: form.userId, // Keep userId to avoid retyping
        Date: "",
        status: "Present",
        remarks: ""
      });
    } catch (error) {
      console.error("Error:", error);
      setSuccess("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Mark Attendance 📋
        </h2>

        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={form.userId}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
        />

        <input
          type="date"
          name="Date"
          value={form.Date}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <input
          type="text"
          name="remarks"
          placeholder="Remarks (optional)"
          value={form.remarks}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 w-full p-3 rounded font-semibold transition"
          disabled={loading}
        >
          {loading ? "Marking..." : "Mark Attendance"}
        </button>

        {success && (
          <p className="mt-4 text-center text-green-400">{success}</p>
        )}
      </form>
    </div>
  );
}

export default MarkAttendance;
