import { Link } from 'react-router-dom';
import { Search, Sparkles, Users } from 'lucide-react';

export const Home = () => {
  const col1Games = [
    "https://steamcdn-a.akamaihd.net/steam/apps/730/library_600x900_2x.jpg",     // CS2
    "https://steamcdn-a.akamaihd.net/steam/apps/1245620/library_600x900_2x.jpg", // Elden Ring
    "https://steamcdn-a.akamaihd.net/steam/apps/238960/library_600x900_2x.jpg",  // Path of Exile
    "https://steamcdn-a.akamaihd.net/steam/apps/1091500/library_600x900_2x.jpg", // Cyberpunk 2077
    "https://steamcdn-a.akamaihd.net/steam/apps/1086940/library_600x900_2x.jpg", // Baldur's Gate 3
    "https://steamcdn-a.akamaihd.net/steam/apps/292030/library_600x900_2x.jpg",  // Wiedźmin 3
  ];

  const col2Games = [
    "https://steamcdn-a.akamaihd.net/steam/apps/570/library_600x900_2x.jpg",     // Dota 2
    "https://steamcdn-a.akamaihd.net/steam/apps/1562430/library_600x900_2x.jpg", // Vampire Survivors
    "https://steamcdn-a.akamaihd.net/steam/apps/582660/library_600x900_2x.jpg",  // Black Desert
    "https://steamcdn-a.akamaihd.net/steam/apps/271590/library_600x900_2x.jpg",  // GTA V
    "https://steamcdn-a.akamaihd.net/steam/apps/1172470/library_600x900_2x.jpg", // Apex Legends
    "https://steamcdn-a.akamaihd.net/steam/apps/578080/library_600x900_2x.jpg",  // PUBG
  ];

  const col3Games = [
    "https://steamcdn-a.akamaihd.net/steam/apps/1174180/library_600x900_2x.jpg", // RDR2
    "https://steamcdn-a.akamaihd.net/steam/apps/413150/library_600x900_2x.jpg",  // Stardew Valley
    "https://steamcdn-a.akamaihd.net/steam/apps/105600/library_600x900_2x.jpg",  // Terraria
    "https://steamcdn-a.akamaihd.net/steam/apps/367520/library_600x900_2x.jpg",  // Hollow Knight
    "https://steamcdn-a.akamaihd.net/steam/apps/582010/library_600x900_2x.jpg",  // Monster Hunter World
    "https://steamcdn-a.akamaihd.net/steam/apps/1593500/library_600x900_2x.jpg", // God of War
  ];

  const col4Games = [
    "https://steamcdn-a.akamaihd.net/steam/apps/1145360/library_600x900_2x.jpg", // Hades
    "https://steamcdn-a.akamaihd.net/steam/apps/814380/library_600x900_2x.jpg",  // Sekiro
    "https://steamcdn-a.akamaihd.net/steam/apps/489830/library_600x900_2x.jpg",  // Skyrim
    "https://steamcdn-a.akamaihd.net/steam/apps/1551360/library_600x900_2x.jpg", // Helldivers 2
    "https://steamcdn-a.akamaihd.net/steam/apps/1966720/library_600x900_2x.jpg", // Lethal Company
    "https://steamcdn-a.akamaihd.net/steam/apps/1623730/library_600x900_2x.jpg", // Palworld
  ];

  const createInfiniteList = (games: string[]) => [...games, ...games, ...games, ...games];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 pt-16">
      
      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-infinite-scroll-up { 
          animation: scroll-up 80s linear infinite; 
        }
        .animate-infinite-scroll-down { 
          animation: scroll-down 100s linear infinite; 
        }
      `}</style>

      {/* Złagodzone, bardziej rozmyte tło */}
      <div className="absolute inset-0 z-0 flex gap-4 sm:gap-6 justify-center items-center opacity-15 transform -skew-y-6 scale-125 pointer-events-none blur-[2px]">
        
        <div className="flex flex-col gap-4 sm:gap-6 animate-infinite-scroll-up">
          {createInfiniteList(col1Games).map((url, i) => (
            <img key={`col1-${i}`} src={url} alt="" className="w-32 sm:w-48 rounded-xl shadow-2xl opacity-70 grayscale-[30%]" />
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 animate-infinite-scroll-down">
          {createInfiniteList(col2Games).map((url, i) => (
            <img key={`col2-${i}`} src={url} alt="" className="w-32 sm:w-48 rounded-xl shadow-2xl opacity-70 grayscale-[30%]" />
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 animate-infinite-scroll-up hidden md:flex">
          {createInfiniteList(col3Games).map((url, i) => (
            <img key={`col3-${i}`} src={url} alt="" className="w-32 sm:w-48 rounded-xl shadow-2xl opacity-70 grayscale-[30%]" />
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 animate-infinite-scroll-down hidden lg:flex">
          {createInfiniteList(col4Games).map((url, i) => (
            <img key={`col4-${i}`} src={url} alt="" className="w-32 sm:w-48 rounded-xl shadow-2xl opacity-70 grayscale-[30%]" />
          ))}
        </div>

      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20 z-0 pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-[-5vh] animate-in fade-in slide-in-from-bottom-16 duration-1000 ease-out fill-mode-both">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-sm font-semibold tracking-widest uppercase">System Inżynierski</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight mb-6 leading-[1.1]">
          Wykorzystaj algorytm <br/>
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-sm">
            Jaccarda
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          GameSense to autorska implementacja matematycznego ważenia profilu gracza, stworzona do analizy i krzyżowania bibliotek platformy Steam.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/overlap" 
            className="flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-[0_0_30px_rgba(16,185,129,0.3)] w-full sm:w-auto group"
          >
            <Users size={24} className="group-hover:scale-110 transition-transform duration-300" />
            Skaner Kompatybilności
          </Link>
          <Link 
            to="/search" 
            className="flex items-center justify-center gap-3 bg-slate-800/80 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 border border-slate-700 backdrop-blur-sm shadow-xl w-full sm:w-auto group"
          >
            <Search size={24} className="group-hover:rotate-12 transition-transform duration-300 text-emerald-400" />
            Baza Gier (IGDB)
          </Link>
        </div>
      </div>
    </div>
  );
};