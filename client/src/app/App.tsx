import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import paska nawigacji
import { Navbar } from '../components/Navbar'; 

// Importy Twoich poszczególnych widoków
// (zwróć uwagę na nawiasy klamrowe - w Profile używamy ich, jeśli w Profile.tsx dałeś 'export const Profile', a nie 'export default')
import { Search } from '../pages/Search';
import { Overlap } from '../pages/Overlap';
import { Profile } from '../pages/Profile';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';

// Import nowego widoku łapiącego powrót z logowania Steam
import AuthCallback from '../pages/AuthCallback';


export const App = () => {
  return (
    <BrowserRouter>
      {/* 
        Główny kontener aplikacji. 
        min-h-screen zapewnia, że tło zajmie zawsze 100% wysokości ekranu,
        a bg-slate-950 nadaje globalny, bardzo ciemny granatowy kolor.
      */}
      <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
        
        {/* Górny pasek nawigacji wyświetlany na każdej podstronie */}
        <Navbar />

        {/* Kontener na główną treść zmieniającą się w zależności od URL */}
        <main className="pb-12">
          <Routes>
            {/* Opcjonalnie: ustawienie wyszukiwarki jako strony głównej po wejściu na root (/) */}
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/overlap" element={<Overlap />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* NOWA ŚCIEŻKA: Obsługa powrotu z backendu po udanym/nieudanym logowaniu */}
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </main>
        
      </div>
    </BrowserRouter>
  );
};