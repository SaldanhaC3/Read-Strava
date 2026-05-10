import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, BarChart2, Activity, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 flex justify-between h-16 items-center">
        <Link to="/" className="font-bold text-xl flex items-center gap-2 text-emerald-600">
          <BookOpen className="w-6 h-6" />
          Striking
        </Link>
        
        {user ? (
          <div className="flex gap-4 items-center text-sm font-medium text-slate-600">
            <Link to="/library" className="hover:text-emerald-600 flex items-center gap-1"><BookOpen className="w-4 h-4"/> Library</Link>
            <Link to="/stats" className="hover:text-emerald-600 flex items-center gap-1"><BarChart2 className="w-4 h-4"/> Stats</Link>
            <Link to="/feed" className="hover:text-emerald-600 flex items-center gap-1"><Activity className="w-4 h-4"/> Feed</Link>
            <Link to="/profile" className="hover:text-emerald-600 flex items-center gap-1"><UserIcon className="w-4 h-4"/> Profile</Link>
            <button onClick={logout} className="hover:text-red-500 ml-4">Logout</button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/auth" className="text-emerald-600 font-medium hover:underline">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
