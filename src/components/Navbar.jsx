import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-gray-900 shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-extrabold text-white flex items-center gap-2">
        🌟 Attendify
      </Link>

      {!user && (
        <div className="space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white font-medium">Login</Link>
          <Link to="/register" className="text-gray-300 hover:text-white font-medium">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
