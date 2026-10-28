import { useState } from 'react';
import { User, Clock, Trophy, Gamepad2, LogOut, ChevronDown, Shield, Award, Flame, Zap, Crown, Sparkles, Ghost, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../shared/api/gamesense-api';
import { Loader } from '../components/Loader';

// Rozbudowana skala rang i kategorii gracza na podstawie godzin
const getPlaytimeRank = (totalMinutes: number) => {
  const hours = totalMinutes / 60;

  if (hours >= 10000) {
    return {
      title: "Legenda",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      badgeBorder: "border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.5)]",
      icon: Crown,
    };
  } else if (hours >= 5000) {
    return {
      title: "Weteran",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      badgeBorder: "border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]",
      icon: Sparkles,
    };
  } else if (hours >= 2500) {
    return {
      title: "Hardkorowy Gracz",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      badgeBorder: "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
      icon: Flame,
    };
  } else if (hours >= 1500) {
    return {
      title: "Wciągnięty w Fabułę",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      badgeBorder: "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)]",
      icon: Compass,
    };
  } else if (hours >= 750) {
    return {
      title: "Aktywny Gracz",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      badgeBorder: "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]",
      icon: Zap,
    };
  } else if (hours >= 250) {
    return {
      title: "Regularny Bywalec",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      badgeBorder: "border-emerald-500",
      icon: Award,
    };
  } else if (hours >= 100) {
    return {
      title: "Niedzielny Graczyk",
      color: "text-teal-400 bg-teal-500/10 border-teal-500/30",
      badgeBorder: "border-teal-600",
      icon: Shield,
    };
  } else {
    return {
      title: "Świeżak",
      color: "text-slate-400 bg-slate-800 border-slate-700",
      badgeBorder: "border-slate-600",
      icon: Ghost,
    };
  }
};

export const Profile = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [visibleCount, setVisibleCount] = useState(5);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => {
      if (!userId || !token) throw new Error("Brak autoryzacji");
      return getUserProfile(userId, token);
    },
    enabled: !!userId && !!token,
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/search');
    window.location.reload(); 
  };

  if (!userId || !token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-24 text-slate-300 gap-4">
        <p className="text-lg">Zaloguj się przez Steam, aby zobaczyć swoją bibliotekę.</p>
        <button 
          onClick={() => navigate('/login')} 
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg"
        >
          Przejdź do logowania
        </button>
      </div>
    );
  }

  if (isLoading) return <div className="mt-24"><Loader /></div>;
  if (isError || !profile) return <div className="text-red-400 text-center pt-24 font-semibold">Nie udało się załadować profilu gier.</div>;

  const rank = getPlaytimeRank(profile.totalPlaytimeMinutes ?? 0);
  const RankIcon = rank.icon;

  const recentGames = profile.recentGames ?? [];
  const displayedGames = recentGames.slice(0, visibleCount);
  const hasMore = visibleCount < recentGames.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, recentGames.length));
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- NAGŁÓWEK PROFILU --- */}
        <div className="bg-slate-800/50 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative">
              <img 
                src={profile.avatarUrl ?? "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"} 
                alt="Avatar" 
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 ${rank.badgeBorder} object-cover transition-all`}
              />
              <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 p-2 rounded-full shadow-lg" title={rank.title}>
                <RankIcon className={`w-5 h-5 ${rank.color.split(' ')[0]}`} />
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{profile.username}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${rank.color}`}>
                  <RankIcon size={14} />
                  {rank.title}
                </span>
              </div>
              <p className="text-slate-400 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base font-medium">
                <User size={16} className="text-emerald-400" /> Steam ID: <span className="text-slate-300 font-mono">{profile.steamId}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-3 rounded-xl transition-all font-semibold hover:scale-105 shrink-0 shadow-lg"
          >
            <LogOut size={18} />
            <span>Wyloguj się</span>
          </button>
        </div>

        {/* --- STATYSTYKI --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 flex flex-col items-center hover:border-emerald-500/50 transition-colors shadow-xl">
            <div className="p-3 bg-emerald-500/10 rounded-2xl mb-3 text-emerald-400 border border-emerald-500/20">
              <Gamepad2 size={28} />
            </div>
            <p className="text-slate-400 text-sm font-medium">Zsynchronizowane gry</p>
            <p className="text-3xl font-black text-white mt-1">{profile.gameCount}</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 flex flex-col items-center hover:border-cyan-500/50 transition-colors shadow-xl">
            <div className="p-3 bg-cyan-500/10 rounded-2xl mb-3 text-cyan-400 border border-cyan-500/20">
              <Clock size={28} />
            </div>
            <p className="text-slate-400 text-sm font-medium">Łączny czas gry</p>
            <p className="text-3xl font-black text-white mt-1">
              {Math.floor(profile.totalPlaytimeMinutes / 60)}h
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 flex flex-col items-center hover:border-yellow-500/50 transition-colors shadow-xl">
            <div className="p-3 bg-yellow-500/10 rounded-2xl mb-3 text-yellow-400 border border-yellow-500/20">
              <Trophy size={28} />
            </div>
            <p className="text-slate-400 text-sm font-medium">Ulubiony gatunek</p>
            <p className="text-xl font-bold text-white mt-1 text-center">
              {profile.topGenres?.[0]?.name ?? "Brak danych"}
            </p>
          </div>
        </div>

        {/* --- BIBLIOTEKA GIER Z SYSTEMEM PACZEK (+10) --- */}
        <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-700/50">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Twoja Biblioteka Steam</h2>
              <p className="text-slate-400 text-sm mt-1">Wyświetlanie zoptymalizowane pod kątem wydajności.</p>
            </div>
            <span className="bg-slate-900 border border-slate-700 text-emerald-400 text-sm font-bold px-4 py-1.5 rounded-xl">
              Pokazano {displayedGames.length} z {recentGames.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayedGames.map((game) => (
              <div key={game.gameId} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-all shadow-lg">
                
                {game.coverUrl ? (
                  <div className="h-56 w-full bg-slate-950 relative flex items-center justify-center p-3">
                    <img 
                      src={game.coverUrl} 
                      alt={game.name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg rounded-sm"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes('library_600x900.jpg')) {
                          target.src = target.src.replace('library_600x900.jpg', 'header.jpg');
                        } else {
                          target.style.display = 'none';
                          const fallbackIcon = target.parentElement?.querySelector('.fallback-icon');
                          if (fallbackIcon) fallbackIcon.classList.remove('hidden');
                        }
                      }}
                    />
                    <Gamepad2 className="fallback-icon w-10 h-10 text-slate-700 hidden absolute" />
                  </div>
                ) : (
                  <div className="h-56 w-full bg-slate-900/50 flex items-center justify-center group-hover:bg-slate-800/50 transition-colors">
                    <Gamepad2 className="w-10 h-10 text-slate-700" />
                  </div>
                )}
                
                <div className="p-4 flex flex-col gap-2 border-t border-slate-800/80 bg-slate-900/90 flex-1 justify-between">
                  <h3 className="text-sm font-bold text-white truncate" title={game.name}>
                    {game.name}
                  </h3>
                  <div className="flex items-center text-xs text-slate-400 gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {Math.floor(game.playtimeMinutes / 60)} godz.
                    </span>
                  </div>
                </div>
                
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 text-center">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 hover:border-emerald-500/50 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
              >
                <span>Załaduj kolejne 10 gier</span>
                <ChevronDown size={18} />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};