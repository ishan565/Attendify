import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import MarkAttendance from "./pages/MarkAttendance";
import Welcome from './pages/Welcome';
import Quiz from "./pages/Quiz";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Navbar />
      <Routes>
        {/* Dynamic redirect based on auth */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Welcome />
            )
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mark-attendance" element={<MarkAttendance />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
       {/* ✅ Add Quiz Route */}
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          }
          />
          </Routes>
    
    </div>
  );
}

export default App;
