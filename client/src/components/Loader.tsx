import { Loader2, Gamepad2 } from 'lucide-react';

export const Loader = ({ text = "Ładowanie danych..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full">
      <div className="relative flex items-center justify-center">
        {/* Zewnętrzny, obracający się pierścień */}
        <Loader2 size={64} className="text-emerald-500 animate-spin absolute" />
        {/* Wewnętrzna, pulsująca ikona pada */}
        <Gamepad2 size={28} className="text-cyan-400 animate-pulse" />
      </div>
      <p className="mt-6 text-lg font-semibold text-slate-300 animate-pulse">
        {text}
      </p>
    </div>
  );
};