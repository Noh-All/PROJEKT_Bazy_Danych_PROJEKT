import React, { useState, useEffect } from 'react';

function DriverPortal() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); 
  // Domyślną zakładką niech będzie teraz grafik, bo to on jest najważniejszy po zalogowaniu!
  const [activeTab, setActiveTab] = useState('harmonogram');
  
  // Stany skanera
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);

  // Stany usterki
  const [usterkaIdAutobusu, setUsterkaIdAutobusu] = useState('101'); 
  const [usterkaOpis, setUsterkaOpis] = useState('');

  // --- NOWE STANY: GRAFIK KIEROWCY ---
  const [mojeKursy, setMojeKursy] = useState([]);

  // Pobieranie grafiku od razu po wejściu w zakładkę "harmonogram"
  useEffect(() => {
    if (user && activeTab === 'harmonogram') {
      pobierzMojeKursy();
    }
  }, [activeTab, user]);

  const pobierzMojeKursy = async () => {
    try {
      // Pobiera kursy używając ID zalogowanego pracownika
      const res = await fetch(`http://localhost:8080/api/kursy/moje/${user.id_uzytkownika}`);
      if (res.ok) {
        setMojeKursy(await res.json());
      }
    } catch (err) {
      console.error("Błąd pobierania grafiku", err);
    }
  };

  const handleZmienStatusKursu = async (idKursu, nowyStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/api/kursy/status?idKursu=${idKursu}&nowyStatus=${nowyStatus}`, {
        method: 'POST'
      });
      if (res.ok) {
        pobierzMojeKursy(); // Odświeża listę, żeby zmienił się kolor i przycisk
      } else {
        alert("Wystąpił błąd podczas zmiany statusu.");
      }
    } catch (err) {
      alert("Błąd połączenia z serwerem.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/api/uzytkownicy/logowanie', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ login, haslo: password })
    });
    const data = await res.json();
    if (data.sukces && data.rola === 'KIEROWCA') {
      setUser({ login, ...data });
    } else {
      alert("Brak dostępu! Upewnij się, że masz rolę KIEROWCA.");
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    const adminAuth = btoa('kamil:123');
    try {
      const res = await fetch('http://localhost:8080/api/bilety/skanuj', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${adminAuth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ kod_qr: scanInput })
      });
      const data = await res.json();
      if (res.ok) setScanResult({ success: true, message: data.message });
      else setScanResult({ success: false, message: data.error });
    } catch {
      setScanResult({ success: false, message: "Błąd połączenia z serwerem." });
    }
  };

  const handleZglosUsterke = async (e) => {
    e.preventDefault();
    if (!usterkaOpis.trim()) return alert("Opis usterki nie może być pusty!");

    try {
      const url = `http://localhost:8080/api/usterki/zglos?idAutobusu=${usterkaIdAutobusu}&opis=${encodeURIComponent(usterkaOpis)}`;
      const res = await fetch(url, { method: 'POST' });
      if (res.ok) {
        alert("✅ Usterka została pomyślnie zgłoszona do bazy!");
        setUsterkaOpis(''); 
      } else {
        alert("❌ Wystąpił błąd podczas zgłaszania usterki.");
      }
    } catch (err) {
      alert("Błąd połączenia z serwerem.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl space-y-4">
          <h2 className="text-2xl font-black text-center text-gray-800">Logowanie Kierowcy</h2>
          <input type="text" onChange={(e) => setLogin(e.target.value)} placeholder="Login" className="w-full p-4 border rounded-xl bg-gray-50 focus:bg-white transition" required />
          <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Hasło" className="w-full p-4 border rounded-xl bg-gray-50 focus:bg-white transition" required />
          <button className="w-full bg-yellow-500 py-4 rounded-xl font-black text-gray-900 hover:bg-yellow-400 transition cursor-pointer">ZALOGUJ SIĘ</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 pt-10 sm:pt-20">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="p-5 bg-gray-900 text-yellow-500 font-black text-center text-lg tracking-widest">
          TERMINAL: {user.login}
        </div>
        
        {/* Zaktualizowane menu z 3 zakładkami */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button onClick={() => setActiveTab('harmonogram')} className={`flex-1 py-4 font-bold text-xs sm:text-sm transition-colors ${activeTab === 'harmonogram' ? 'bg-yellow-500 text-gray-900 shadow-inner' : 'text-gray-500 hover:bg-gray-200'}`}>🗓️ GRAFIK</button>
          <button onClick={() => setActiveTab('skaner')} className={`flex-1 py-4 font-bold text-xs sm:text-sm transition-colors ${activeTab === 'skaner' ? 'bg-yellow-500 text-gray-900 shadow-inner' : 'text-gray-500 hover:bg-gray-200'}`}>📷 SKANER</button>
          <button onClick={() => setActiveTab('usterki')} className={`flex-1 py-4 font-bold text-xs sm:text-sm transition-colors ${activeTab === 'usterki' ? 'bg-yellow-500 text-gray-900 shadow-inner' : 'text-gray-500 hover:bg-gray-200'}`}>🔧 USTERKI</button>
        </div>
        
        <div className="p-6">
          
          {/* ZAKŁADKA 1: GRAFIK (NOWA) */}
          {activeTab === 'harmonogram' && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 text-center mb-4 uppercase tracking-wide">Twój plan na dziś</h3>
              
              {mojeKursy.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 font-bold">☕ Brak przypisanych kursów.</p>
                  <p className="text-xs text-gray-400 mt-1">Odpoczywaj lub skontaktuj się z biurem.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {mojeKursy.map(kurs => (
                    <div key={kurs.id_kursu} className={`p-5 rounded-xl border-2 shadow-sm flex flex-col gap-3 transition-all ${kurs.status_kursu === 'W TRAKCIE' ? 'border-yellow-400 bg-yellow-50' : kurs.status_kursu === 'ZAKONCZONY' ? 'border-gray-200 bg-gray-50 opacity-75' : 'border-blue-100 bg-white'}`}>
                      
                      <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                        <span className="font-black text-gray-800 text-lg leading-tight">
                          {kurs.trasa ? kurs.trasa.nazwa_linii : 'Nieznana linia'}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-1 rounded tracking-wider uppercase ${kurs.status_kursu === 'W TRAKCIE' ? 'bg-yellow-400 text-yellow-900' : kurs.status_kursu === 'ZAKONCZONY' ? 'bg-gray-300 text-gray-600' : 'bg-blue-100 text-blue-800'}`}>
                          {kurs.status_kursu || 'ZAPLANOWANY'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 flex flex-col gap-1 font-medium">
                        <span>🗓️ Odjazd: <span className="text-gray-900 font-bold">{new Date(kurs.data_odjazdu).toLocaleString('pl-PL', { hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit'})}</span></span>
                        <span>🚌 Autobus: <span className="text-gray-900 font-bold">{kurs.autobus ? kurs.autobus.numer_rejestracyjny : '?'}</span></span>
                      </div>
                      
                      <div className="mt-2 pt-2">
                        {/* WYŚWIETLANIE ODPOWIEDNIEGO PRZYCISKU W ZALEŻNOŚCI OD STATUSU */}
                        {(!kurs.status_kursu || kurs.status_kursu === 'ZAPLANOWANY') && (
                          <button onClick={() => handleZmienStatusKursu(kurs.id_kursu, 'W TRAKCIE')} className="w-full bg-green-500 text-white font-black py-4 rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-200 cursor-pointer text-lg">
                            🟢 ROZPOCZNIJ KURS
                          </button>
                        )}
                        
                        {kurs.status_kursu === 'W TRAKCIE' && (
                          <button onClick={() => handleZmienStatusKursu(kurs.id_kursu, 'ZAKONCZONY')} className="w-full bg-red-500 text-white font-black py-4 rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-200 cursor-pointer text-lg animate-pulse">
                            🔴 ZAKOŃCZ KURS
                          </button>
                        )}
                        
                        {kurs.status_kursu === 'ZAKONCZONY' && (
                          <div className="text-center text-sm font-bold text-gray-400 bg-gray-200 py-3 rounded-xl border border-gray-300">
                            Pomyślnie zrealizowano ✔️
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ZAKŁADKA 2: SKANER (BEZ ZMIAN) */}
          {activeTab === 'skaner' && (
            <form onSubmit={handleScan} className="space-y-4">
              <div className="text-center mb-6">
                <span className="text-4xl">📱</span>
                <p className="font-bold text-gray-600 mt-2">Przyłóż kod QR do skanera</p>
              </div>
              <input type="text" value={scanInput} onChange={(e) => setScanInput(e.target.value)} placeholder="Wpisz kod QR..." className="w-full p-4 border-2 border-gray-300 rounded-xl font-mono text-center text-lg focus:border-yellow-500 outline-none transition" required />
              <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-lg hover:bg-gray-800 transition cursor-pointer">WERYFIKUJ BILET</button>
              {scanResult && <div className={`p-4 rounded-xl text-center font-bold border-2 ${scanResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>{scanResult.message}</div>}
            </form>
          )}

          {/* ZAKŁADKA 3: USTERKI (BEZ ZMIAN) */}
          {activeTab === 'usterki' && (
            <form onSubmit={handleZglosUsterke} className="space-y-4">
              <div className="text-center mb-6">
                <span className="text-4xl">⚠️</span>
                <p className="font-bold text-gray-600 mt-2">Zgłoś problem z pojazdem</p>
              </div>
              <select value={usterkaIdAutobusu} onChange={(e) => setUsterkaIdAutobusu(e.target.value)} className="w-full p-4 border-2 border-gray-300 rounded-xl bg-white outline-none focus:border-yellow-500 transition" required>
                <option value="101">Mercedes Sprinter (KR-1001)</option>
                <option value="102">Setra S 415 (TA-1003)</option>
                <option value="103">Solaris Urbino (WAW-999)</option>
              </select>
              <textarea value={usterkaOpis} onChange={(e) => setUsterkaOpis(e.target.value)} placeholder="Opisz dokładnie, co nie działa (np. brak lewego kierunkowskazu)..." className="w-full p-4 border-2 border-gray-300 rounded-xl h-32 resize-none outline-none focus:border-yellow-500 transition" required></textarea>
              <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-lg hover:bg-red-700 transition shadow-lg shadow-red-200 cursor-pointer">WYSŁAĆ ZGŁOSZENIE RAPORTU</button>
            </form>
          )}

        </div>
        
        {/* Przycisk wylogowania na samym dole terminala */}
        <button onClick={() => {setUser(null); setLogin(''); setPassword('');}} className="w-full bg-gray-100 text-gray-400 text-xs py-3 font-bold hover:bg-gray-200 hover:text-gray-600 transition cursor-pointer">
          Wyloguj i zamknij zmianę
        </button>

      </div>
    </div>
  );
}

export default DriverPortal;