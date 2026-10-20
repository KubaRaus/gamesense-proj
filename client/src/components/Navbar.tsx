import { Link, useLocation } from 'react-router-dom';
import { Search, Users, User, Gamepad2, LogIn } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  // Funkcja sprawdzająca aktywną zakładkę
  const isActive = (path: string) => location.pathname === path;

  // Symulacja stanu logowania. 
  // Zmień na false, żeby przetestować, jak znika Profil i pojawia się przycisk "Zaloguj się".
  // Docelowo: const isLoggedIn = Boolean(localStorage.getItem('token'));
  const isLoggedIn = true; 

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Lewa strona: Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Gamepad2 className="text-emerald-500 group-hover:scale-110 transition-transform duration-300" size={30} />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
              GameSense
            </span>
          </Link>

          {/* Środek: Główne zakładki (dostępne dla wszystkich) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/search"
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 ${
                isActive('/search') 
                  ? 'bg-slate-800 text-emerald-400 shadow-inner' 
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-emerald-400'
              }`}
            >
              <Search size={18} />
              <span className="font-semibold text-sm hidden md:block">Wyszukiwarka</span>
            </Link>

            <Link
              to="/overlap"
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 ${
                isActive('/overlap') 
                  ? 'bg-slate-800 text-emerald-400 shadow-inner' 
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-emerald-400'
              }`}
            >
              <Users size={18} />
              <span className="font-semibold text-sm hidden md:block">Taste Overlap</span>
            </Link>
          </div>

          {/* Prawa strona: Strefa Użytkownika */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              /* Zalogowany: Widzi tylko link do swojego profilu */
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 ${
                  isActive('/profile') 
                    ? 'bg-slate-800 text-emerald-400 shadow-inner' 
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-emerald-400'
                }`}
              >
                <User size={18} />
                <span className="font-semibold text-sm hidden sm:block">Mój Profil</span>
              </Link>
            ) : (
              /* Niezalogowany: Widzi wezwanie do logowania */
              <Link 
                to="/test" /* <-- Pamiętaj, aby zmienić /test na docelowy endpoint logowania z Waszego API */
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-900/20"
              >
                <LogIn size={18} />
                <span className="text-sm font-bold hidden sm:block">Zaloguj się</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};