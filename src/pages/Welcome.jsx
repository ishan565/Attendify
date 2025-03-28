import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-gray-900 px-6 py-20 text-white">
      <div className="text-center w-full max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Welcome to <span className="text-blue-400">Attendify</span> 🎓
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Simplify your attendance tracking at university. Monitor your attendance,
          get reminders when it's low, and stay on top of your academics — all in one place.
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium shadow-md transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
