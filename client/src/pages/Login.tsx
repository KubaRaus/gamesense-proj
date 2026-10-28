import { Gamepad2, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const handleRealLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    window.location.href = `${apiUrl}/auth/steam`;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden pt-16">
      
      {/* Tło Gradientowe */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-slate-950 to-slate-950 z-0" />
      
      {/* Karta Logowania */}
      <div className="relative z-10 w-full max-w-md p-10 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl text-center">
        <div className="flex justify-center mb-8">
          <div className="p-5 bg-emerald-500/10 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] border border-emerald-500/20">
            <Gamepad2 className="w-12 h-12 text-emerald-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-white mb-3 tracking-wide">
          Autoryzacja
        </h2>
        <p className="text-slate-400 mb-10 text-sm leading-relaxed">
          Zaloguj się kontem Steam, aby zsynchronizować bibliotekę gier i uruchomić algorytm kompatybilności.
        </p>

        <button
          onClick={handleRealLogin}
          className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white py-4 px-6 rounded-xl transition-all duration-300 border border-slate-700 group hover:border-emerald-500/50"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" 
            alt="Steam Logo" 
            className="w-6 h-6 group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0"
          />
          <span className="font-bold text-lg">Zaloguj przez Steam</span>
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-950/50 py-3 px-4 rounded-lg border border-slate-800/50">
          <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
          <p>
            Bezpieczne logowanie OpenID. <br/>Nie mamy dostępu do Twojego hasła.
          </p>
        </div>
      </div>
    </div>
  );
}