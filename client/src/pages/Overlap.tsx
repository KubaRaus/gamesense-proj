import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users, Percent, Gamepad2, Clock, Trophy } from 'lucide-react';
import { getCompatibility } from '../shared/api/gamesense-api';
import { Loader } from '../components/Loader';

export const Overlap = () => {
  const currentUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [searchInput, setSearchInput] = useState('');
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  const { data: overlapData, isLoading, isError } = useQuery({
    queryKey: ['compatibility', currentUserId, targetUserId],
    queryFn: () => {
      if (!currentUserId || !token || !targetUserId) throw new Error("Brak danych do porównania");
      return getCompatibility(currentUserId, targetUserId, token);
    },
    enabled: !!currentUserId && !!token && !!targetUserId,
  });

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTargetUserId(searchInput.trim());
    }
  };

  if (!currentUserId || !token) {
    return <div className="text-center pt-24 text-slate-400">Zaloguj się, aby korzystać z tej funkcji.</div>;
  }

  const topGenreA = overlapData?.genreBreakdown ? [...overlapData.genreBreakdown].sort((a, b) => b.userAWeight - a.userAWeight)[0]?.genre : null;
  const topGenreB = overlapData?.genreBreakdown ? [...overlapData.genreBreakdown].sort((a, b) => b.userBWeight - a.userBWeight)[0]?.genre : null;

  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* --- NOWY, LEPSZY DESIGN WYSZUKIWARKI --- */}
        <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700/50 mb-10 text-center relative overflow-hidden">
          {/* Dekoracyjne, świecące tło na samej górze karty */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4 tracking-tight flex items-center justify-center gap-3">
            <Users className="text-emerald-400" size={36} />
            Skaner Kompatybilności
          </h1>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Narzędzie inżynierskie: Wprowadź Steam ID drugiego gracza, aby zainicjować algorytm Jaccarda i zestawić Wasze biblioteki gier.
          </p>
          
          <form onSubmit={handleCompare} className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto relative z-10">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="text" 
                placeholder="Wklej Steam ID..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
              />
            </div>
            <button 
              type="submit"
              disabled={!searchInput.trim()}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-95 min-w-[140px]"
            >
              <Search size={20} />
              <span>Skanuj</span>
            </button>
          </form>
        </div>

        {/* --- EKRAN ŁADOWANIA LUB BŁĘDU --- */}
        {isLoading && <div className="mt-12"><Loader /></div>}
        {isError && (
          <div className="text-center text-red-500 bg-red-500/10 border border-red-500/20 p-4 rounded-xl max-w-lg mx-auto">
            Nie udało się pobrać danych. Upewnij się, że ID znajomego jest poprawne.
          </div>
        )}

        {/* --- WYNIKI KOMPATYBILNOŚCI --- */}
        {overlapData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* GŁÓWNY WIDOK POJEDYNKU (VS) */}
            <div className="bg-slate-800 p-10 rounded-3xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col items-center relative overflow-hidden">
              
              <h2 className="text-xl text-slate-400 font-semibold mb-8 uppercase tracking-wider">Kompatybilność profili</h2>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 w-full max-w-3xl">
                
                {/* Lewa Strona - Ty */}
                <div className="flex flex-col items-center flex-1">
                  <img 
                    src={overlapData.userAInfo?.avatarUrl ?? "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"} 
                    alt="Twój Avatar" 
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-emerald-500 object-cover shadow-lg"
                  />
                  <span className="mt-4 font-bold text-xl text-white">{overlapData.userAInfo?.username ?? "Gracz A"}</span>
                  {topGenreA && (
                    <span className="mt-2 flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg">
                      <Trophy size={14} className="text-emerald-500" /> {topGenreA}
                    </span>
                  )}
                </div>

                {/* Środek - Procent */}
                <div className="flex flex-col items-center shrink-0 my-6 sm:my-0">
                  <div className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center">
                    {Math.round(overlapData.overlapPercentage)} 
                    <Percent className="text-cyan-400 ml-1" size={40} />
                  </div>
                  <span className="text-slate-400 font-medium mt-2">Wspólne gry: {overlapData.commonGames?.length ?? 0}</span>
                </div>

                {/* Prawa Strona - Znajomy */}
                <div className="flex flex-col items-center flex-1">
                  <img 
                    src={overlapData.userBInfo?.avatarUrl ?? "https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"} 
                    alt="Avatar Znajomego" 
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-cyan-500 object-cover shadow-lg"
                  />
                  <span className="mt-4 font-bold text-xl text-white">{overlapData.userBInfo?.username ?? "Gracz B"}</span>
                  {topGenreB && (
                    <span className="mt-2 flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg">
                      <Trophy size={14} className="text-cyan-500" /> {topGenreB}
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* LISTA WSPÓLNYCH GIER */}
            {overlapData.commonGames && overlapData.commonGames.length > 0 && (
              <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Gamepad2 className="text-emerald-400" />
                  Gry do wspólnego co-opa
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {overlapData.commonGames.map((game) => (
                    <div key={game.gameId} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-colors">
                      
                      {/* OKŁADKA GRY */}
                      {game.coverUrl ? (
                        <div className="h-56 w-full bg-slate-950 relative flex items-center justify-center p-3">
                          <img 
                            src={game.coverUrl} 
                            alt={game.name}
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
                      
                      <div className="p-4 flex flex-col gap-2 border-t border-slate-800">
                        <h4 className="text-sm font-bold text-white truncate" title={game.name}>
                          {game.name}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1 text-emerald-400"><Clock size={12}/> Ty: {Math.floor(game.userAPlaytimeMinutes / 60)}h</span>
                          <span className="flex items-center gap-1 text-cyan-400"><Users size={12}/> On/a: {Math.floor(game.userBPlaytimeMinutes / 60)}h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};