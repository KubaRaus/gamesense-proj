import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
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
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Wyszukiwarka Gier</h1>
      
      {/* Pasek Wyszukiwania */}
      <form onSubmit={handleSearch} className="relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-32 py-4 border border-slate-700 rounded-xl leading-5 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-colors shadow-sm"
          placeholder="Szukaj tytułów z bazy IGDB..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={gamesMutation.isPending || !query.trim()}
          className="absolute right-2 top-2 bottom-2 bg-green-500 hover:bg-green-400 text-slate-900 font-bold px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {gamesMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Szukaj'
          )}
        </button>
      </form>

      {/* Komunikat o błędzie żądania HTTP */}
      {gamesMutation.isError && (
        <div className="text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-900/50 mb-8">
          Wystąpił błąd podczas pobierania danych. Sprawdź, czy serwer backendu działa prawidłowo.
        </div>
      )}

      {/* Siatka Wyników (CSS Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gamesList.map((game) => (
          <div 
            key={game.id}
            className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-green-400 transition-all hover:-translate-y-1 group cursor-pointer flex flex-col"
          >
             {/* Miejsce na okładkę gry */}
             <div className="aspect-[3/4] bg-slate-700 flex items-center justify-center overflow-hidden">
               {game.coverUrl ? (
                 <img 
                   src={game.coverUrl}
                   alt={game.name}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                 />
               ) : (
                 <span className="text-slate-500 text-sm">Brak okładki</span>
               )}
             </div>
             
             {/* Dane o grze */}
             <div className="p-4 flex flex-col flex-1">
               <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2">
                 {game.name}
               </h3>
               
               <div className="mt-auto flex flex-wrap gap-2">
                 {game.releaseYear && (
                   <span className="inline-block bg-slate-900 text-xs px-2 py-1 rounded text-slate-400 border border-slate-700">
                     {game.releaseYear}
                   </span>
                 )}
                 {game.genres.map((genre) => (
                   <span
                     key={genre}
                     className="inline-block bg-slate-900 text-xs px-2 py-1 rounded text-slate-300 border border-slate-700"
                   >
                     {genre}
                   </span>
                 ))}
                 <span className="inline-block bg-slate-900 text-xs px-2 py-1 rounded text-green-400 border border-green-900/50">
                   Gra wideo
                 </span>
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* Pusty stan - wyszukiwanie zakończone, brak wyników */}
      {hasSearched && gamesList.length === 0 && !gamesMutation.isError && (
        <div className="text-center text-slate-400 mt-12 bg-slate-800/50 py-12 rounded-xl border border-slate-700 border-dashed">
          <p className="text-lg">Nie znaleziono gier dla frazy "<span className="text-white font-medium">{query}</span>".</p>
          <p className="text-sm mt-2">Spróbuj wpisać inną nazwę.</p>
        </div>
      )}
      
      {/* Tryb diagnostyczny (widoczny tylko jeśli backend zwraca nietypowe dane) */}
      {hasSearched && gamesList.length === 0 && gamesMutation.data && (
        <div className="mt-12 bg-slate-900 p-4 rounded-xl border border-yellow-500/50 text-slate-300">
          <h3 className="text-yellow-400 font-bold mb-2">Diagnostic Data:</h3>
          <pre className="text-xs overflow-auto bg-slate-950 p-4 rounded">{JSON.stringify(gamesMutation.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};