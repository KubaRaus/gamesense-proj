import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Users, Loader2, Gamepad2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
// Upewnij się, że ścieżka do api jest prawidłowa:
import { getCompatibility } from '../shared/api/gamesense-api';

export const Overlap = () => {
  const [userA, setUserA] = useState('usr_1');
  const [userB, setUserB] = useState('usr_2');
  // Na potrzeby prototypu zakładamy sztuczny token, docelowo pobierzesz go z Zustand/localStorage
  const token = localStorage.getItem('gamesense.prototype.token') || 'mock_token';

  const compatibilityMutation = useMutation({
    mutationFn: () => getCompatibility(userA, userB, token)
  });

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (userA && userB) {
      compatibilityMutation.mutate();
    }
  };

  // Dane do wykresu (zakładamy, że backend zwraca procentowy wynik zgodności np. { score: 65 })
  // Zabezpieczamy dane na wypadek innej struktury
  const score = compatibilityMutation.data?.score || compatibilityMutation.data?.compatibility || 0;
  
  const chartData = [
    { name: 'Zgodność', value: score },
    { name: 'Różnica', value: 100 - score },
  ];
  const COLORS = ['#22c55e', '#1e293b']; // Zielony Tailwind (green-500) i Ciemny (slate-800)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/30">
          <Users className="w-8 h-8 text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Taste Overlap</h1>
          <p className="text-slate-400">Porównaj biblioteki gier za pomocą indeksu Jaccarda.</p>
        </div>
      </div>

      {/* Formularz wprowadzania użytkowników */}
      <form onSubmit={handleCompare} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl mb-12 flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-400 mb-2">Twój identyfikator</label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            value={userA}
            onChange={(e) => setUserA(e.target.value)}
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-400 mb-2">Identyfikator znajomego</label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={userB}
            onChange={(e) => setUserB(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={compatibilityMutation.isPending || !userA || !userB}
          className="w-full md:w-auto h-[50px] bg-green-500 hover:bg-green-400 text-slate-900 font-bold px-8 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {compatibilityMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Oblicz dopasowanie'}
        </button>
      </form>

      {/* Wyniki Analizy */}
      {compatibilityMutation.isSuccess && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Wykres Recharts */}
          <div className="lg:col-span-1 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Wskaźnik Zgodności</h3>
            <div className="w-full h-[200px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-white">{score}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">Obliczono metodą Jaccarda</p>
          </div>

          {/* Lista Wspólnych Gier */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-300 mb-6 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-green-400" />
              Wspólne tytuły
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Opcjonalne: Mapowanie po prawdziwych grach, jeśli API je zwraca */}
              {compatibilityMutation.data?.commonGames?.length > 0 ? (
                compatibilityMutation.data.commonGames.map((game: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex-shrink-0 border border-slate-600"></div>
                    <div>
                      <p className="text-white font-medium">{game.name || 'Gra'}</p>
                      <p className="text-xs text-slate-400">Znaleziona u obu graczy</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-slate-400 flex items-center justify-center p-8 bg-slate-900/50 rounded-xl border border-slate-700 border-dashed">
                  Brak precyzyjnej listy gier w odpowiedzi z API.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {compatibilityMutation.isError && (
         <div className="text-red-400 bg-red-900/20 p-4 rounded-xl border border-red-900/50 mt-8">
           Nie udało się obliczyć kompatybilności. Upewnij się, że wpisane ID są poprawne.
         </div>
      )}
    </div>
  );
};