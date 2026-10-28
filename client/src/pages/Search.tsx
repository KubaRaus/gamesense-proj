import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Search as SearchIcon, Loader2, Database } from 'lucide-react';
import { searchGames } from '../shared/api/gamesense-api';

export const Search = () => {
  const [query, setQuery] = useState('');

  const gamesMutation = useMutation({
    mutationFn: (q: string) => searchGames(q)
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      gamesMutation.mutate(query);
    }
  };

  const gamesList = gamesMutation.data?.items ?? [];
  const hasSearched = gamesMutation.isSuccess;

  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700/50 mb-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-4 tracking-tight flex items-center justify-center gap-3">
            <Database className="text-cyan-400" size={36}/>
            Baza Gier IGDB
          </h1>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Przeszukuj globalną bazę tysięcy tytułów. Dane w czasie rzeczywistym zsynchronizowane z oficjalnym API IGDB.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto relative z-10">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                placeholder="Wpisz tytuł gry..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={gamesMutation.isPending || !query.trim()}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-95 min-w-[140px]"
            >
              {gamesMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <SearchIcon size={20} />
                  <span>Szukaj</span>
                </>
              )}
            </button>
          </form>
        </div>

        {gamesMutation.isError && (
          <div className="text-red-400 bg-red-950/30 p-4 rounded-2xl border border-red-900/50 mb-8 max-w-2xl mx-auto text-center font-medium">
            Wystąpił błąd podczas pobierania danych z API. Upewnij się, że backend działa.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {gamesList.map((game:any) => (
            <div 
              key={game.id}
              className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1.5 group cursor-pointer flex flex-col"
            >
              <div className="aspect-[3/4] bg-slate-950 relative flex items-center justify-center overflow-hidden">
                {game.coverUrl ? (
                  <img 
                    src={game.coverUrl}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                  />
                ) : (
                  <Database className="w-10 h-10 text-slate-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
              </div>
              
              <div className="p-4 flex flex-col flex-1 relative z-10 -mt-8">
                <h3 className="font-bold text-white mb-2 line-clamp-2 text-sm drop-shadow-md">
                  {game.name}
                </h3>
                
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {game.releaseYear && (
                    <span className="inline-block bg-slate-800/80 text-[10px] px-2 py-0.5 rounded-md text-cyan-400 border border-slate-700 font-medium">
                      {game.releaseYear}
                    </span>
                  )}
                  {game.genres.slice(0, 2).map((genre:any) => (
                    <span
                      key={genre}
                      className="inline-block bg-slate-800/80 text-[10px] px-2 py-0.5 rounded-md text-slate-300 border border-slate-700"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasSearched && gamesList.length === 0 && !gamesMutation.isError && (
          <div className="text-center text-slate-400 mt-12 bg-slate-800/30 py-16 rounded-3xl border border-slate-700/50 border-dashed max-w-2xl mx-auto">
            <SearchIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-xl">Brak wyników dla frazy "<span className="text-white font-bold">{query}</span>"</p>
            <p className="text-sm mt-2 text-slate-500">Spróbuj wpisać inny tytuł z bazy IGDB.</p>
          </div>
        )}
        
      </div>
    </div>
  );
};