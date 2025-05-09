import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite/appwriteConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await account.deleteSession('current');
    } catch {}

    try {
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();     // ✅ fetch user
      setUser(userData);                        // ✅ update context
      navigate('/dashboard');                   // ✅ go to dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg text-white border border-white/20 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back 🫶</h1>
        <p className="text-sm text-gray-300 text-center mb-6">
          Please login to continue to <span className="text-blue-400 font-semibold">Attendify</span>
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
          >
            Log In
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>

        {/* Add the Sign Up link here */}
        <p className="text-center text-gray-300 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Sign Up Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
