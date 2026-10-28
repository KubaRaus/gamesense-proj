import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Gamepad2, Search, User, LogOut, LogIn, Home, Users } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
            <Gamepad2 className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wider">
              GameSense
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-6">
            <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Główna</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/search" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium">
                  <Search className="w-4 h-4" />
                  <span className="hidden md:inline">Baza Gier</span>
                </Link>
                <Link to="/overlap" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium">
                  <Users className="w-4 h-4" />
                  <span className="hidden md:inline">Overlap (VS)</span>
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium border-l border-slate-700 pl-6 ml-2">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">Twój Profil</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 px-4 py-2 rounded-lg transition-all text-sm font-medium ml-2 border border-slate-700 hover:border-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Wyloguj</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-lg transition-all text-sm font-bold ml-4 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
              >
                <LogIn className="w-4 h-4" />
                Zaloguj się
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}