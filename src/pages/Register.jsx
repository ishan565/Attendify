import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite/appwriteConfig';
import { ID } from 'appwrite';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg text-white border border-white/20 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-2">Join Attendify 🚀</h1>
        <p className="text-sm text-gray-300 text-center mb-6">
          Create your account and start tracking attendance effortlessly.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setName(e.target.value)}
          />
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
            Register
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

<p className="text-sm text-gray-300 text-center mt-4">
  Already have an account?{' '}
  <a href="/login" className="text-blue-400 hover:underline">
    Log in here
  </a>
</p>

        </form>
      </div>
    </div>
  );
}

export default Register;
