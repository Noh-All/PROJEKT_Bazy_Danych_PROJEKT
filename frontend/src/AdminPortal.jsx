import React, { useState } from 'react';

function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [activeTab, setActiveTab] = useState('personel'); 

  // --- STANY DLA NOWEGO PRACOWNIKA ---
  const [nowyLogin, setNowyLogin] = useState('');
  const [nowaRola, setNowaRola] = useState('');
  const [uprDodawanie, setUprDodawanie] = useState(false);
  const [uprRaporty, setUprRaporty] = useState(false);
  const [uprZmiany, setUprZmiany] = useState(false);

  // SYMULACJA LOGOWANIA
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'start123' && login !== 'admin_glowny') {
      setNeedsPasswordChange(true); 
    } else {
      setIsLoggedIn(true);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert(`Hasło biurowe zostało zmienione!`);
    setNeedsPasswordChange(false); setIsLoggedIn(true);
  };

  // PRAWDZIWE WYSYŁANIE PRACOWNIKA DO JAVY
  const handleDodajPracownika = async (e) => {
    e.preventDefault();
    
    // Budujemy listę uprawnień tylko, jeśli to biuro
    let uprawnieniaString = "BRAK";
    if (nowaRola === 'BIURO') {
      const upr = [];
      if (uprDodawanie) upr.push("DODAWANIE_KIEROWCOW");
      if (uprRaporty) upr.push("RAPORTY");
      if (uprZmiany) upr.push("ZMIANY_TRAS");
      uprawnieniaString = upr.join(", ");
    }

    const adminAuth = btoa('kamil:123'); // Nasza podstawowa autoryzacja
    
    try {
      const res = await fetch('http://localhost:8080/api/uzytkownicy/dodaj-pracownika', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${adminAuth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          login: nowyLogin, 
          rola: nowaRola, 
          uprawnienia: uprawnieniaString 
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(`✅ Sukces! Konto utworzone.\n\nPrzekaż pracownikowi dane:\nLogin: ${nowyLogin}\nHasło startowe: ${data.haslo_startowe}`);
        // Czyszczenie formularza po sukcesie
        setNowyLogin(''); setNowaRola(''); setUprDodawanie(false); setUprRaporty(false); setUprZmiany(false);
      } else {
        const err = await res.json();
        alert("❌ Błąd: " + err.error);
      }
    } catch (err) {
      alert("Błąd połączenia z serwerem.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-black text-center mb-2 text-blue-900">Panel Zarządzania</h1>
          {!needsPasswordChange ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login pracownika" required className="w-full p-4 border rounded-xl" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło" required className="w-full p-4 border rounded-xl" />
              <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition cursor-pointer">Zaloguj się</button>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl text-center mb-4 font-bold text-sm">Nowe konto. Wymagana zmiana hasła.</div>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Twoje nowe hasło biurowe" required className="w-full p-4 border rounded-xl" />
              <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl cursor-pointer">Zmień hasło i wejdź</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex pt-16">
      {/* Pasek Boczny */}
      <div className="w-64 bg-blue-900 text-white min-h-screen p-6 fixed left-0 top-0 pt-20">
        <h2 className="text-2xl font-black mb-8 text-blue-300">TransitHub<br/><span className="text-sm font-normal text-white">BackOffice</span></h2>
        <div className="space-y-2">
          <button onClick={() => setActiveTab('personel')} className={`w-full text-left p-3 rounded-lg font-bold cursor-pointer transition ${activeTab === 'personel' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>👥 Zarządzaj Personelem</button>
          <button onClick={() => setActiveTab('trasy')} className={`w-full text-left p-3 rounded-lg font-bold cursor-pointer transition ${activeTab === 'trasy' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>🗺️ Trasy i Przystanki</button>
          <button onClick={() => setActiveTab('flota')} className={`w-full text-left p-3 rounded-lg font-bold cursor-pointer transition ${activeTab === 'flota' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>🚌 Flota i Usterki</button>
          <button onClick={() => setActiveTab('raporty')} className={`w-full text-left p-3 rounded-lg font-bold cursor-pointer transition ${activeTab === 'raporty' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>📊 Raporty Biletowe</button>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="mt-10 w-full bg-red-500 p-3 rounded-lg font-bold hover:bg-red-600 cursor-pointer transition">Wyloguj ({login})</button>
      </div>

      {/* Główna Zawartość */}
      <div className="flex-1 p-10 ml-64">
        {activeTab === 'personel' && (
          <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-blue-600">
            <h3 className="text-2xl font-bold mb-6">Dodaj Nowego Pracownika</h3>
            
            {/* Zaktualizowany formularz przypięty do Javy */}
            <form className="space-y-4 max-w-xl" onSubmit={handleDodajPracownika}>
              <input type="text" value={nowyLogin} onChange={(e) => setNowyLogin(e.target.value)} placeholder="Login (np. jan_biuro)" required className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none" />
              
              <select value={nowaRola} onChange={(e) => setNowaRola(e.target.value)} className="w-full p-3 border rounded-lg bg-white focus:border-blue-500 outline-none" required>
                <option value="">Wybierz rolę...</option>
                <option value="BIURO">Pracownik Biurowy</option>
                <option value="KIEROWCA">Kierowca</option>
              </select>

              {/* Tabela uprawnień znika magicznie, jeśli to nie jest BIURO! */}
              {nowaRola === 'BIURO' && (
                <div className="p-4 border rounded-lg bg-gray-50 transition-all">
                  <p className="font-bold mb-2">Uprawnienia pracownika:</p>
                  <label className="block cursor-pointer hover:bg-gray-200 p-1 rounded"><input type="checkbox" checked={uprDodawanie} onChange={(e) => setUprDodawanie(e.target.checked)} className="mr-2" /> Dodawanie kierowców</label>
                  <label className="block cursor-pointer hover:bg-gray-200 p-1 rounded"><input type="checkbox" checked={uprRaporty} onChange={(e) => setUprRaporty(e.target.checked)} className="mr-2" /> Raporty sprzedaży</label>
                  <label className="block cursor-pointer hover:bg-gray-200 p-1 rounded"><input type="checkbox" checked={uprZmiany} onChange={(e) => setUprZmiany(e.target.checked)} className="mr-2" /> Zmiany tras i flot</label>
                </div>
              )}

              <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-lg shadow-blue-200">Utwórz Konto</button>
            </form>
          </div>
        )}
        
        {activeTab === 'flota' && (
          <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-blue-600">
            <h3 className="text-2xl font-bold mb-6">Stan Floty (Zgłoszone Usterki)</h3>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex justify-between items-center mb-4">
              <div>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">DO NAPRAWY</span>
                <p className="font-bold mt-2">Mercedes Sprinter (KR-1001)</p>
                <p className="text-sm text-gray-600">Zgłosił: kierowca_adam | Dziwne stuki w silniku na wyższych obrotach.</p>
              </div>
              <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 cursor-pointer transition">Oznacz jako Naprawiony</button>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex justify-between items-center">
              <div>
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">SPRAWNY</span>
                <p className="font-bold mt-2">Setra S 415 (TA-1003)</p>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'trasy' || activeTab === 'raporty') && (
          <div className="text-center py-20 text-gray-400 font-bold text-xl">Moduł w przygotowaniu (Oczekuje na spięcie z Javą)</div>
        )}
      </div>
    </div>
  );
}

export default AdminPortal;