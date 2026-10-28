import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasExchanged = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Błąd logowania ze Steam:', error);
      navigate('/login');
      return;
    }

    if (code && !hasExchanged.current) {
      hasExchanged.current = true;
      
      const exchangeCodeForToken = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
          
          const response = await fetch(`${apiUrl}/auth/steam/exchange`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          if (!response.ok) throw new Error('Odrzucono kod wymiany');

          const data = await response.json();
          console.log("Odebrane dane:", data);

          // Zapisujemy poprawny accessToken pod kluczem 'token'
          if (data.accessToken) {
            localStorage.setItem('token', data.accessToken);
          }

          // Wyciągamy ID z obiektu user zwróconego przez backend
          if (data.user && data.user.id) {
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('user', JSON.stringify(data.user)); 
          }

          // Przechodzimy na profil
          navigate('/profile');
        } catch (err) {
          console.error('Błąd wymiany klucza:', err);
          navigate('/login');
        }
      };

      exchangeCodeForToken();
    } else if (!code) {
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
      <Gamepad2 className="w-16 h-16 text-green-400 mb-6 animate-pulse" />
      <p className="text-green-400 mt-4 font-semibold tracking-wide text-xl">
        Autoryzacja połączona. Wymiana kluczy bezpieczeństwa...
      </p>
    </div>
  );
}