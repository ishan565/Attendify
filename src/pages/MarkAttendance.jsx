// import { useState } from "react";
// import { databases } from "../appwrite/appwriteConfig";
// import { ID, Query } from "appwrite";
// import { useNavigate } from "react-router-dom";

// function MarkAttendance() {
//   const [form, setForm] = useState({
//     userId: "",
//     Date: "",
//     status: "Present",
//     remarks: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setSuccess("");
//     setError("");

//     try {
//       // 1. Check if a record exists for userId and Date
//       const res = await databases.listDocuments(
//         "67dd782e000f6230d82b", // Database ID
//         "67dd784200275f2e2ed1", // Collection ID
//         [
//           Query.equal("userId", form.userId),
//           Query.equal("Date", form.Date)
//         ]
//       );

//       // 2. If exists, delete the old record
//       if (res.documents.length > 0) {
//         const oldDocId = res.documents[0].$id;
//         await databases.deleteDocument(
//           "67dd782e000f6230d82b",
//           "67dd784200275f2e2ed1",
//           oldDocId
//         );
//       }

//       // 3. Create the new record
//       await databases.createDocument(
//         "67dd782e000f6230d82b",
//         "67dd784200275f2e2ed1",
//         ID.unique(),
//         form
//       );

//       setSuccess("Attendance marked successfully!");

//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 1000);

//       setForm({
//         userId: form.userId,
//         Date: "",
//         status: "Present",
//         remarks: ""
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       setError("Something went wrong. Try again!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-screen min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center text-white">
//           Mark Attendance 📋
//         </h2>

//         <input
//           type="text"
//           name="userId"
//           placeholder="User ID"
//           value={form.userId}
//           onChange={handleChange}
//           required
//           className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
//         />

//         <input
//           type="date"
//           name="Date"
//           value={form.Date}
//           onChange={handleChange}
//           required
//           className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
//         />

//         <select
//           name="status"
//           value={form.status}
//           onChange={handleChange}
//           className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
//         >
//           <option value="Present">Present</option>
//           <option value="Absent">Absent</option>
//         </select>

//         <input
//           type="text"
//           name="remarks"
//           placeholder="Remarks (optional)"
//           value={form.remarks}
//           onChange={handleChange}
//           className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
//         />

//         <button
//           type="submit"
//           className="bg-blue-600 hover:bg-blue-700 w-full p-3 rounded font-semibold transition"
//           disabled={loading}
//         >
//           {loading ? "Marking..." : "Mark Attendance"}
//         </button>

//         {success && (
//           <p className="mt-4 text-center text-green-400">{success}</p>
//         )}
//         {error && (
//           <p className="mt-4 text-center text-red-400">{error}</p>
//         )}
//       </form>
//     </div>
//   );
// }

// export default MarkAttendance;

import { useState, useEffect } from "react";
import { databases } from "../appwrite/appwriteConfig";
import { ID, Query } from "appwrite";
import { useNavigate } from "react-router-dom";

function MarkAttendance() {
  const [form, setForm] = useState({
    userId: "",
    date: "",
    status: "Present",
    remarks: ""
  });
  const [existingRecord, setExistingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingRecord = async () => {
      if (form.userId && form.date) {
        try {
          const res = await databases.listDocuments(
            "67dd782e000f6230d82b",
            "67dd784200275f2e2ed1",
            [Query.equal("userId", form.userId), Query.equal("Date", form.date)]
          );
          setExistingRecord(res.documents[0] || null);
        } catch (error) {
          console.error("Record check error:", error);
        }
      }
    };
    checkExistingRecord();
  }, [form.date, form.userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.date) return;

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      let result;
      if (existingRecord) {
        // Update existing record if status changes
        if (existingRecord.status !== form.status) {
          result = await databases.updateDocument(
            "67dd782e000f6230d82b",
            "67dd784200275f2e2ed1",
            existingRecord.$id,
            { status: form.status, remarks: form.remarks }
          );
          setSuccess(`Status updated to ${form.status}`);
        } else {
          setSuccess("Attendance already recorded");
        }
      } else {
        // Create new record if none exists
        result = await databases.createDocument(
          "67dd782e000f6230d82b",
          "67dd784200275f2e2ed1",
          ID.unique(),
          { ...form, Date: form.date }
        );
        setSuccess("Attendance marked successfully!");
      }

      // Refresh existing record after update
      if (result) {
        setExistingRecord(result);
      }

      // Clear form fields except userId
      setForm(prev => ({
        ...prev,
        date: "",
        status: "Present",
        remarks: ""
      }));

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {existingRecord ? "Update Attendance" : "Mark Attendance"}
        </h2>

        {existingRecord && (
          <div className="mb-4 p-3 bg-yellow-900 text-yellow-200 rounded-lg">
            Current Status: {existingRecord.status} (Last updated:{" "}
            {new Date(existingRecord.$updatedAt).toLocaleString()})
          </div>
        )}

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
          name="date"
          value={form.date}
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
          {loading ? "Processing..." : existingRecord ? "Update Status" : "Submit Attendance"}
        </button>

        {success && <p className="mt-4 text-center text-green-400">{success}</p>}
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </form>
    </div>
  );
}

export default MarkAttendance;
