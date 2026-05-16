import React, { useState } from 'react';

function App() {
  const [wyniki, setWyniki] = useState([]);
  const [loading, setLoading] = useState(false);

  // Stany dla logowania i okienek
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Stany dla formularzy (żeby React pamiętał, co wpisujesz)
  const [loginInput, setLoginInput] = useState('');
  const [hasloInput, setHasloInput] = useState('');
  
  const [regLogin, setRegLogin] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regHaslo, setRegHaslo] = useState('');

  // --- WYSZUKIWANIE BILETÓW ---
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Jeśli jesteś zalogowany, używamy Twoich danych. Jeśli nie, używamy konta testowego Kamila.
    const zaszyfrowaneDane = isLoggedIn ? btoa(`${loginInput}:${hasloInput}`) : btoa('kamil:123');

    try {
      const odpowiedz = await fetch('http://localhost:8080/api/kursy', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${zaszyfrowaneDane}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!odpowiedz.ok) throw new Error(`Błąd: ${odpowiedz.status}`);
      
      const dane = await odpowiedz.json();
      setWyniki(dane);
    } catch (error) {
      console.log("Błąd serwera - ładuję dane pokazowe:", error.message);
      setWyniki([
        { 
          id_kursu: 999, 
          data_odjazdu: '2026-05-20T15:00:00',
          cena_bazowa: 25.50,
          trasa: { nazwa_linii: 'TransitExpress (Linia Szybka)' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGOWANIE DO BAZY ---
  const handleZalogujSubmit = async (e) => {
    e.preventDefault(); 
    
    const zaszyfrowaneDane = btoa(`${loginInput}:${hasloInput}`);
    
    try {
      const odpowiedz = await fetch('http://localhost:8080/api/uzytkownicy/logowanie', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${zaszyfrowaneDane}`,
          'Content-Type': 'application/json'
        }
      });

      if (odpowiedz.ok) {
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        alert("Pomyślnie zalogowano do systemu!");
      } else {
        alert("Błędny login lub hasło! Spróbuj ponownie.");
      }
    } catch (error) {
      alert("Błąd połączenia z serwerem logowania.");
    }
  };

  // --- REJESTRACJA DO BAZY ---
  const handleRejestracjaSubmit = async (e) => {
    e.preventDefault();
    
    // Używamy uprawnień Kamila, żeby przepuścić rejestrację przez zabezpieczenia Spring Security
    const adminAuth = btoa('kamil:123'); 

    try {
      const odpowiedz = await fetch('http://localhost:8080/api/uzytkownicy/rejestracja', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${adminAuth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: regLogin,
          email: regEmail,
          haslo: regHaslo
        })
      });

      if (odpowiedz.ok) {
        alert("Konto zostało utworzone! Możesz się teraz zalogować.");
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
      } else {
        alert("Wystąpił błąd podczas tworzenia konta.");
      }
    } catch (error) {
      alert("Błąd połączenia z serwerem.");
    }
  };

  const sprawdzBilety = () => {
    if (isLoggedIn) {
      alert("Tutaj w przyszłości pojawi się lista Twoich zakupionych biletów.");
    } else {
      alert("Musisz być zalogowany, aby przeglądać swoje bilety!");
      setIsLoginModalOpen(true);
    }
  };

  const kupBilet = (idKursu) => {
    if (isLoggedIn) {
      alert(`Przekierowuję do płatności za kurs nr ${idKursu}. Przygotuj portfel!`);
    } else {
      alert("Najpierw musisz się zalogować, żeby kupić bilet.");
      setIsLoginModalOpen(true);
    }
  };

  const formatujDate = (dataString) => {
    const data = new Date(dataString);
    const godzina = data.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const dzien = data.toLocaleDateString('pl-PL');
    return { godzina, dzien };
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      {/* Header */}
      <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter text-orange-500 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            TRANSITHUB
          </h1>
          <div className="space-x-6 text-sm font-medium flex items-center">
            <button onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition cursor-pointer">Rozkład</button>
            <button onClick={sprawdzBilety} className="hover:text-orange-500 transition cursor-pointer">Moje Bilety</button>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300">Witaj, {loginInput}!</span>
                <button onClick={() => { setIsLoggedIn(false); setLoginInput(''); setHasloInput(''); alert("Wylogowano."); }} className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer text-white">
                  Wyloguj
                </button>
              </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700 transition cursor-pointer text-white">
                Zaloguj
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Gdzie chcesz jechać?</h2>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Skąd?" className="p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition" />
              <input type="text" placeholder="Dokąd?" className="p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition" />
              <button type="submit" className="bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-200 cursor-pointer">
                Szukaj połączenia
              </button>
            </form>
          </div>

          {/* Wyniki wyszukiwania */}
          <div className="space-y-4">
            {loading && (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Łączenie z bazą danych...</p>
              </div>
            )}

            {!loading && wyniki.map((wynik) => {
              const { godzina, dzien } = formatujDate(wynik.data_odjazdu);
              
              return (
                <div key={wynik.id_kursu} className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-orange-500 flex flex-col md:flex-row justify-between items-center hover:shadow-lg transition">
                  <div className="mb-4 md:mb-0">
                    <div className="text-3xl font-black text-gray-800 flex items-baseline gap-2">
                      Odjazd: {godzina} 
                      <span className="text-sm font-normal text-gray-500">({dzien})</span>
                    </div>
                    <div className="text-orange-600 font-bold text-sm uppercase tracking-widest mt-1">
                      Linia: {wynik.trasa ? wynik.trasa.nazwa_linii : 'Brak przypisanej trasy'}
                    </div>
                    <div className="text-gray-400 text-xs mt-1 italic">ID Kursu: #{wynik.id_kursu}</div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-gray-400 uppercase font-bold">Cena biletu</div>
                      <div className="text-3xl font-black text-gray-900">{wynik.cena_bazowa} PLN</div>
                    </div>
                    <button onClick={() => kupBilet(wynik.id_kursu)} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-500 transition cursor-pointer">
                      KUP BILET
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* --- MODAL LOGOWANIA --- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-xl font-bold cursor-pointer">X</button>
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Witaj ponownie!</h2>
            <form onSubmit={handleZalogujSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Login</label>
                <input type="text" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" placeholder="Twój login" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hasło</label>
                <input type="password" value={hasloInput} onChange={(e) => setHasloInput(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer">
                Zaloguj się
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500">
              Nie masz konta?{' '}
              <button onClick={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }} className="text-orange-600 font-bold hover:underline cursor-pointer">
                Zarejestruj się
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL REJESTRACJI --- */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setIsRegisterModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-xl font-bold cursor-pointer">X</button>
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Dołącz do TransitHub</h2>
            <form onSubmit={handleRejestracjaSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Wybierz Login</label>
                <input type="text" value={regLogin} onChange={(e) => setRegLogin(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" placeholder="np. marcin99" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Adres Email</label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" placeholder="twoj@email.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hasło</label>
                <input type="password" value={regHaslo} onChange={(e) => setRegHaslo(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer">
                Załóż konto
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500">
              Masz już konto?{' '}
              <button onClick={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }} className="text-orange-600 font-bold hover:underline cursor-pointer">
                Zaloguj się
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;