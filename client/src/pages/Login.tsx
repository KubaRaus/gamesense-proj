import { Gamepad2 } from 'lucide-react';

export const Login = () => {
  // Funkcja, która w przyszłości zainicjuje przepływ logowania przez Steam
  const handleLogin = () => {
    console.log("Inicjalizacja logowania Steam...");
    // Tutaj dodasz przekierowanie do endpointu backendu, np.:
    // window.location.href = `${API_BASE_URL}/auth/steam`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] p-4">
      {/* Karta Logowania */}
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center">
        
        {/* Logo/Ikona */}
        <div className="bg-green-500/20 p-4 rounded-full mb-6">
          <Gamepad2 className="w-12 h-12 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">GameSense</h1>
        <p className="text-slate-400 mb-8">
          Połącz swoje statystyki i znajdź graczy o podobnym guście.
        </p>

        {/* Przycisk Logowania Steam */}
        <button
          onClick={handleLogin}
          className="w-full relative group bg-[#171a21] hover:bg-[#2a475e] text-white font-medium py-3 px-6 rounded-lg border border-[#2a475e] transition-all duration-200 flex items-center justify-center gap-3 overflow-hidden shadow-lg"
        >
          {/* Subtelny efekt połysku na hover */}
          <div className="absolute inset-0 w-1/4 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
          
          {/* Możesz tu dodać ikonę Steam, jeśli masz odpowiedni asset SVG, na razie używamy tekstu */}
          <span className="font-semibold tracking-wide">Zaloguj przez Steam</span>
        </button>

        <p className="mt-6 text-xs text-slate-500">
          Korzystamy z protokołu Steam OpenID. <br /> Nie przechowujemy Twojego hasła.
        </p>
      </div>
    </div>
  );
};