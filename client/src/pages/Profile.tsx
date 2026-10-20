import { User, Clock, Trophy, Gamepad2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const navigate = useNavigate();

  // Funkcja obsługująca wylogowanie
  const handleLogout = () => {
    // 1. Usuwamy token sesji (upewnij się, pod jakim kluczem zapisujecie go z Kubą)
    localStorage.removeItem('token'); // lub sessionStorage.clear()
    
    // 2. Przekierowujemy użytkownika z powrotem do wyszukiwarki
    navigate('/search');
    
    // 3. Opcjonalnie wymuszamy odświeżenie strony, by wyczyścić stan Navbaru (zmienna isLoggedIn)
    window.location.reload(); 
  };

  const userData = {
    username: "s0uru",
    avatarUrl: "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    steamId: "76561198012345678",
    totalGames: 142,
    totalPlaytimeHours: 3450,
    topGames: [
      { id: 1, name: "League of Legends", hours: 1200 },
      { id: 2, name: "Elden Ring", hours: 450 },
      { id: 3, name: "Counter-Strike 2", hours: 320 }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4 text-slate-200">
      
      {/* Nagłówek profilu z przyciskiem wylogowania obok */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700">
        
        {/* Lewa strona nagłówka (Avatar i Nick) */}
        <div className="flex items-center gap-8">
          <img 
            src={userData.avatarUrl} 
            alt="Avatar" 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-emerald-500 object-cover shadow-lg"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{userData.username}</h1>
            <p className="text-slate-400 flex items-center gap-2 text-sm sm:text-base">
              <User size={16} /> Steam ID: {userData.steamId}
            </p>
          </div>
        </div>

        {/* Prawa strona nagłówka (Akcja Wyloguj) */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl transition-all font-semibold hover:scale-105"
        >
          <LogOut size={18} />
          <span>Wyloguj się</span>
        </button>
      </div>

      {/* Reszta statystyk profilu - bez zmian */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center hover:border-emerald-500/50 transition-colors">
          <Gamepad2 size={32} className="text-emerald-400 mb-3" />
          <p className="text-slate-400 text-sm">Posiadane gry</p>
          <p className="text-3xl font-bold text-white">{userData.totalGames}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center hover:border-blue-500/50 transition-colors">
          <Clock size={32} className="text-blue-400 mb-3" />
          <p className="text-slate-400 text-sm">Łączny czas gry</p>
          <p className="text-3xl font-bold text-white">{userData.totalPlaytimeHours}h</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center hover:border-yellow-500/50 transition-colors">
          <Trophy size={32} className="text-yellow-400 mb-3" />
          <p className="text-slate-400 text-sm">Ulubiona gra</p>
          <p className="text-xl font-bold text-white mt-1 text-center">{userData.topGames[0].name}</p>
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl mt-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Najczęściej ogrywane</h2>
        <div className="space-y-4">
          {userData.topGames.map((game, index) => (
            <div key={game.id} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-bold text-xl w-6">#{index + 1}</span>
                <span className="font-semibold text-lg">{game.name}</span>
              </div>
              <span className="text-slate-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">{game.hours} godz.</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}