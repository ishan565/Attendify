import { useEffect, useState } from "react";
import { account, databases } from "../appwrite/appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID, Query } from "appwrite";
import { Pie } from "react-chartjs-2";
import emailjs from 'emailjs-com';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import Chatbot from "../components/Chatbot";

emailjs.init('IZkc1YqbLlG2cB06D'); 

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function Dashboard() {
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("present");
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 });
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);

  // NEW: State for subject sort order
  const [subjectSortOrder, setSubjectSortOrder] = useState("asc"); // "asc" or "desc"

  const navigate = useNavigate();
  const databaseId = "67dd782e000f6230d82b";
  const attendanceCollectionId = "67dd784200275f2e2ed1";
  const subjectsCollectionId = "67de7b58003806a737d3";

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getUser();
    // eslint-disable-next-line
  }, []);

  const getOverallPercentage = (attendanceList) => {
    const total = attendanceList.length;
    const present = attendanceList.filter(r => r.status.toLowerCase() === 'present').length;
    return total > 0 ? (present / total) * 100 : 0;
  };

  
  const sendLowAttendanceEmail = (to_email, user_name, attendance_percent) => {
    const templateParams = {
      to_email,
      user_name,
      attendance_percent: attendance_percent.toFixed(1)
    };
  
    emailjs.send(
      'service_fr0g2pj',     
      'template_t2wae6g',     
      templateParams
    ).then(
      (response) => {
        console.log('Email sent!', response.status, response.text);
      },
      (error) => {
        console.error('Email failed:', error);
      }
    );
  };
  
  // useEffect(() => {
  //   if (user && attendanceList.length > 0) {
  //     const percent = getOverallPercentage(attendanceList);
  //     if (percent < 75) {
  //       sendLowAttendanceEmail(user.email, user.name || user.email, percent);
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, [user, attendanceList]);
  
  const getAttendance = async () => {
    try {
      const response = await databases.listDocuments(
        databaseId,
        attendanceCollectionId,
        [Query.equal("userId", user?.$id || "")]
      );
      setAttendanceList(response.documents);

      const presentCount = response.documents.filter(
        (doc) => doc.status.toLowerCase() === "present"
      ).length;
      const absentCount = response.documents.filter(
        (doc) => doc.status.toLowerCase() === "absent"
      ).length;
      setAttendanceStats({ present: presentCount, absent: absentCount });
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    }
  };

  const getSubjects = async () => {
    try {
      const response = await databases.listDocuments(
        databaseId,
        subjectsCollectionId,
        [Query.equal("userId", user?.$id || "")]
      );
      setSubjects(response.documents);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user?.$id) {
        setLoading(true);
        try {
          await getAttendance();
          await getSubjects();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [user]);

  const getSubjectWiseStats = () => {
    const subjectStats = {};
    attendanceList.forEach((record) => {
      const subjectName = record.subject;
      const status = record.status.toLowerCase();
      if (!subjectStats[subjectName]) {
        subjectStats[subjectName] = { present: 0, absent: 0 };
      }
      if (status === "present") {
        subjectStats[subjectName].present += 1;
      } else if (status === "absent") {
        subjectStats[subjectName].absent += 1;
      }
    });
    return subjectStats;
  };

  const handleLogout = async () => {
    await account.deleteSession("current");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await databases.createDocument(databaseId, attendanceCollectionId, ID.unique(), {
        subject,
        Date: date,
        status,
        userId: user.$id,
      });
      alert("Attendance marked successfully!");
      getAttendance();
      setSubject("");
      setDate("");
      setStatus("present");
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance.");
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      if (!newSubjectName.trim()) {
        alert("Please enter a subject name");
        return;
      }
      await databases.createDocument(databaseId, subjectsCollectionId, ID.unique(), {
        subjectName: newSubjectName,
        userId: user.$id,
      });
      alert("Subject added successfully!");
      setNewSubjectName("");
      getSubjects();
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject.");
    }
  };

  const pieChartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendanceStats.present, attendanceStats.absent],
        backgroundColor: ["#4caf50", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  const centerTextPlugin = {
    id: "centerTextPlugin",
    afterDatasetsDraw: (chart) => {
      const { width, height, ctx } = chart;
      const dataset = chart.data.datasets[0];
      const total = dataset.data.reduce((a, b) => a + b, 0);
      const present = dataset.data[0];
      const percent = total ? ((present / total) * 100).toFixed(0) + "%" : "0%";
      ctx.save();
      const fontSize = Math.round(height / 10);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const textX = width / 2;
      const textY = height / 2;
      ctx.fillText(percent, textX, textY);
      ctx.restore();
    },
  };
  

  const handleDeleteSubject = async (subjectId, subjectName) => {
    if (window.confirm("Are you sure you want to delete this subject and all its attendance records?")) {
      try {
        // Delete the subject
        await databases.deleteDocument(databaseId, subjectsCollectionId, subjectId);
  
        // Fetch all attendance records for this subject
        const attendanceToDelete = await databases.listDocuments(
          databaseId,
          attendanceCollectionId,
          [
            Query.equal("subject", subjectName),
            Query.equal("userId", user.$id)
          ]
        );
  
        // Delete each attendance record for this subject
        await Promise.all(
          attendanceToDelete.documents.map((doc) =>
            databases.deleteDocument(databaseId, attendanceCollectionId, doc.$id)
          )
        );
  
        alert("Subject and its attendance records deleted successfully!");
        await getSubjects();
        await getAttendance();
      } catch (error) {
        console.error("Error deleting subject or attendance records:", error);
        alert("Failed to delete subject or its attendance records.");
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-xl">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen flex flex-col md:flex-row items-start justify-start bg-gray-900 px-4 py-20">
      <div className="w-full md:w-1/2 mb-10 md:mb-0 px-6 md:px-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Welcome to <span className="text-blue-400">Attendify</span> 🎓
        </h1>
        {user && (
          <>
            <p className="text-lg md:text-xl text-gray-300 mb-4">
              Logged in as <span className="text-white font-semibold">{user.email}</span>
            </p>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Track your university attendance with ease. Stay notified when your attendance falls below 75%.
            </p>
            <div className="flex gap-4 mb-10">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition"
              >
                Logout
              </button>
            </div>
            {/* Add Subject Panel */}
            <form
              onSubmit={handleAddSubject}
              className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md mb-10"
            >
              <h2 className="text-white text-2xl font-bold mb-4">Add subjects of your semester</h2>
              <div className="mb-4">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Enter Subject Name"
                  required
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Add+
              </button>
            </form>
            {/* Mark Attendance Panel */}
            <form
              onSubmit={handleSubmit}
              className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md"
            >
              <h2 className="text-white text-2xl font-bold mb-4">Mark your attendance</h2>
              <div className="mb-4">
                <label className="block text-white mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subj) => (
                    <option key={subj.$id} value={subj.subjectName}>
                      {subj.subjectName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-white mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-white mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Submit Attendance
              </button>
            </form>
          </>
        )}
      </div>
      {/* Overall Attendance Pie */}
      <div className="w-full md:w-1/2 text-center">
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] shadow-xl rounded-2xl p-6 max-w-md mx-auto transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center border-b border-gray-700 pb-2">
              📊 Overall Attendance Stats
            </h2>
            <div className="mx-auto w-[280px] h-[280px]">
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "50%",
                  animation: {
                    duration: 500,
                    easing: "easeInOutBounce",
                  },
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: "white",
                        font: {
                          size: 14,
                          weight: "500",
                        },
                      },
                    },
                  },
                  layout: {
                    padding: {
                      top: 20,
                      bottom: 20,
                    },
                  },
                }}
                plugins={[centerTextPlugin]}
              />
            </div>
          </div>
        </div>
        {/* Subject-wise Stats with Sort Filter */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <label className="text-white">Sort Subjects:</label>
            <select
              value={subjectSortOrder}
              onChange={(e) => setSubjectSortOrder(e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1 border border-gray-600"
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(getSubjectWiseStats())
              .sort(([a], [b]) =>
                subjectSortOrder === "asc"
                  ? a.localeCompare(b)
                  : b.localeCompare(a)
              )
              .map(([subject, stats]) => {
                const subjectDoc = subjects.find((subj) => subj.subjectName === subject);
                const total = stats.present + stats.absent;
                const presentPercent = total ? ((stats.present / total) * 100).toFixed(1) : "0.0";
                const absentPercent = total ? ((stats.absent / total) * 100).toFixed(1) : "0.0";
                return (
                  <div key={subject} className="bg-gray-800 p-4 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white text-center font-semibold">{subject}</h3>
                      {subjectDoc && (
  <button
    onClick={() => handleDeleteSubject(subjectDoc.$id, subjectDoc.subjectName)}
    className="text-red-400 hover:text-red-500 px-2 py-1 rounded text-sm transition-colors duration-200"
  >
    Delete
  </button>
)}

                    </div>
                    <div className="relative mx-auto w-full h-[250px]">
                      <Pie
                        data={{
                          labels: [
                            `Present (${presentPercent}%)`,
                            `Absent (${absentPercent}%)`,
                          ],
                          datasets: [
                            {
                              data: [stats.present, stats.absent],
                              backgroundColor: ["#4caf50", "#f44336"],
                              borderWidth: 1,
                              borderColor: "#fff",
                              hoverOffset: 12,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          animation: {
                            animateScale: true,
                            animateRotate: true,
                          },
                          plugins: {
                            legend: {
                              position: "bottom",
                              labels: {
                                color: "white",
                              },
                            },
                          },
                          layout: {
                            padding: {
                              top: 20,
                              bottom: 20,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {/* Toggle Button */}
        <button
          onClick={() => setShowChat((prev) => !prev)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
          aria-label="Toggle Chatbot"
        >
          {showChat ? "❌" : "💬"}
        </button>
        {/* Chatbot Panel */}
        {showChat && (
          <div className="fixed bottom-20 right-6 w-80 bg-white shadow-lg rounded-xl border z-50">
            <div className="flex justify-between items-center p-2 border-b">
              <h2 className="text-sm font-semibold">AI Chatbot</h2>
            </div>
            <Chatbot />
          </div>
        )}



    <div className="w-full flex justify-center mt-8">
  <div className="w-full max-w-2xl overflow-x-auto text-white">
    <h2 className="text-2xl font-bold mb-4 py-4 text-center">
      Your Attendance Records
    </h2>
    <table className="w-full text-left border border-gray-700">
      <thead>
        <tr className="bg-gray-800">
          <th className="px-4 py-2">Subject</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {attendanceList.map((record) => (
          <tr key={record.$id} className="bg-gray-700">
            <td className="px-4 py-2">{record.subject}</td>
            <td className="px-4 py-2">{record.Date?.split("T")[0]}</td>
            <td className="px-4 py-2">
              {record.status.toLowerCase() === "present" ? (
                <span className="text-green-400">Present</span>
              ) : (
                <span className="text-red-400">Absent</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </div>
  );
}

export default Dashboard;
