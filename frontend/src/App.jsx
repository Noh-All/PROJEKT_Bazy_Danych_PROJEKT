import React, { useState } from 'react';

function App() {
  // --- STANY APLIKACJI ---
  const [wyniki, setWyniki] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isMyTicketsModalOpen, setIsMyTicketsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loginInput, setLoginInput] = useState('');
  const [hasloInput, setHasloInput] = useState('');
  
  const [regLogin, setRegLogin] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regHaslo, setRegHaslo] = useState('');

  const [skadInput, setSkadInput] = useState('');
  const [dokadInput, setDokadInput] = useState('');
  
  const [mojeBilety, setMojeBilety] = useState([]);

  // --- NOWE STANY DO PŁATNOŚCI ---
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [ticketToPay, setTicketToPay] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('blik');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [blikCode, setBlikCode] = useState('');

  // --- WYSZUKIWANIE KURSÓW ---
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const adminAuth = btoa('kamil:123');

    try {
      const odpowiedz = await fetch(`http://localhost:8080/api/kursy/szukaj?skad=${skadInput}&dokad=${dokadInput}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${adminAuth}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!odpowiedz.ok) throw new Error(`Błąd: ${odpowiedz.status}`);
      const dane = await odpowiedz.json();
      setWyniki(dane);
    } catch (error) {
      console.log("Błąd serwera przy szukaniu.");
      setWyniki([]);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGOWANIE I REJESTRACJA ---
  const handleZalogujSubmit = async (e) => {
    e.preventDefault(); 
    const adminAuth = btoa('kamil:123'); 
    try {
      const odpowiedz = await fetch('http://localhost:8080/api/uzytkownicy/logowanie', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${adminAuth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginInput, haslo: hasloInput })
      });
      if (odpowiedz.ok) {
        setIsLoggedIn(true); setIsLoginModalOpen(false); alert(`Witaj ponownie, ${loginInput}!`);
      } else { alert("Błędny login lub hasło! Spróbuj ponownie."); }
    } catch (error) { alert("Błąd połączenia z serwerem."); }
  };

  const handleRejestracjaSubmit = async (e) => {
    e.preventDefault();
    const adminAuth = btoa('kamil:123'); 
    try {
      const odpowiedz = await fetch('http://localhost:8080/api/uzytkownicy/rejestracja', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${adminAuth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: regLogin, email: regEmail, haslo: regHaslo })
      });
      if (odpowiedz.ok) {
        alert("Konto utworzone!"); setIsRegisterModalOpen(false); setIsLoginModalOpen(true);
      } else { alert("Błąd podczas tworzenia konta."); }
    } catch (error) { alert("Błąd połączenia."); }
  };

  // --- INICJACJA PŁATNOŚCI (Zamiast od razu kupować) ---
  const zainicjujPlatnosc = (opcjaPodrozy) => {
    if (!isLoggedIn) {
      alert("Najpierw musisz się zalogować, żeby przejść do kasy.");
      setIsLoginModalOpen(true);
      return;
    }
    setTicketToPay(opcjaPodrozy);
    setPaymentMethod('blik');
    setBlikCode('');
    setIsPaymentModalOpen(true);
  };

  // --- SYMULACJA BRAMKI I ZAPIS DO BAZY ---
  const finalizujPłatnosc = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'blik' && blikCode.length !== 6) {
      alert("Kod BLIK musi mieć 6 cyfr!");
      return;
    }

    setIsProcessingPayment(true);

    // Symulacja czasu trwania przelewu/blika (2 sekundy)
    setTimeout(async () => {
      const adminAuth = btoa('kamil:123');
      try {
        const listaIdKursow = ticketToPay.kursy.map(k => k.id_kursu);
        const odpowiedz = await fetch('http://localhost:8080/api/bilety/kup', {
          method: 'POST',
          headers: { 'Authorization': `Basic ${adminAuth}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ login_uzytkownika: loginInput, id_kursow: listaIdKursow })
        });

        if (odpowiedz.ok) {
          setMojeBilety([...mojeBilety, ticketToPay]);
          setIsPaymentModalOpen(false);
          setIsMyTicketsModalOpen(true);
        } else {
          alert("Płatność przeszła, ale wystąpił błąd zapisu biletu w bazie.");
        }
      } catch (error) {
        alert("Błąd krytyczny serwera podczas zapisu biletu.");
      } finally {
        setIsProcessingPayment(false);
      }
    }, 2000);
  };

  // --- FORMATOWANIE DATY ---
  const formatujDate = (dataString) => {
    const data = new Date(dataString);
    const godzina = data.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const dzien = data.toLocaleDateString('pl-PL');
    return { godzina, dzien };
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      {/* Pasek Nawigacji */}
      <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter text-orange-500 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            TRANSITHUB
          </h1>
          <div className="space-x-6 text-sm font-medium flex items-center">
            <button onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition cursor-pointer">Rozkład</button>
            <button onClick={() => isLoggedIn ? setIsMyTicketsModalOpen(true) : setIsLoginModalOpen(true)} className="hover:text-orange-500 transition cursor-pointer">
              Moje Bilety ({mojeBilety.length})
            </button>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300">Witaj, {loginInput}!</span>
                <button onClick={() => { setIsLoggedIn(false); setLoginInput(''); setHasloInput(''); setMojeBilety([]); }} className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition cursor-pointer text-white">Wyloguj</button>
              </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700 transition cursor-pointer text-white">Zaloguj</button>
            )}
          </div>
        </div>
      </nav>

      {/* Główna sekcja */}
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Dokąd wyruszasz?</h2>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" value={skadInput} onChange={(e) => setSkadInput(e.target.value)} required placeholder="Skąd?" className="p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition" />
              <input type="text" value={dokadInput} onChange={(e) => setDokadInput(e.target.value)} required placeholder="Dokąd?" className="p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition" />
              <button type="submit" className="bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-200 cursor-pointer">
                Szukaj połączenia
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {loading && (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Szukanie optymalnej trasy...</p>
              </div>
            )}
            {!loading && wyniki.map((opcja) => (
              <div key={opcja.id_opcji} className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-orange-500 hover:shadow-lg transition">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${opcja.typ === 'BEZPOSREDNI' ? 'bg-green-500' : 'bg-blue-500'}`}>
                      {opcja.typ === 'BEZPOSREDNI' ? 'BEZPOŚREDNI' : 'Z PRZESIADKĄ'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-gray-900">{opcja.cena_laczna.toFixed(2)} PLN</span>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  {opcja.kursy.map((kurs, index) => {
                    const { godzina, dzien } = formatujDate(kurs.data_odjazdu);
                    return (
                      <div key={kurs.id_kursu} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 bg-orange-500 rounded-full mt-1"></div>
                          {index !== opcja.kursy.length - 1 && <div className="w-1 h-full bg-gray-300 my-1"></div>}
                        </div>
                        <div className="flex-1">
                          <div className="text-xl font-bold text-gray-800">{kurs.skad} ➔ {kurs.dokad}</div>
                          <div className="text-sm text-gray-500 mt-1">Odjazd: {godzina} ({dzien}) | Linia: {kurs.linia}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end">
                  <button onClick={() => zainicjujPlatnosc(opcja)} className="bg-gray-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-orange-500 transition cursor-pointer">
                    PRZEJDŹ DO KASY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- NOWY MODAL PŁATNOŚCI --- */}
      {isPaymentModalOpen && ticketToPay && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            {!isProcessingPayment && <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-2xl font-bold cursor-pointer">×</button>}
            
            {isProcessingPayment ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Przetwarzanie płatności...</h2>
                <p className="text-gray-500">Proszę nie zamykać tego okna. Trwa autoryzacja bankowa.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Bramka Płatności</h2>
                <p className="text-gray-500 mb-6 border-b pb-4">Do zapłaty: <span className="font-bold text-gray-900">{ticketToPay.cena_laczna.toFixed(2)} PLN</span></p>
                
                <form onSubmit={finalizujPłatnosc} className="space-y-6">
                  {/* Wybór metody płatności */}
                  <div className="grid grid-cols-3 gap-2">
                    <div onClick={() => setPaymentMethod('blik')} className={`border-2 rounded-xl p-3 text-center cursor-pointer font-bold transition ${paymentMethod === 'blik' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      BLIK
                    </div>
                    <div onClick={() => setPaymentMethod('przelew')} className={`border-2 rounded-xl p-3 text-center cursor-pointer font-bold transition ${paymentMethod === 'przelew' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      Przelew
                    </div>
                    <div onClick={() => setPaymentMethod('karta')} className={`border-2 rounded-xl p-3 text-center cursor-pointer font-bold transition ${paymentMethod === 'karta' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      Karta
                    </div>
                  </div>

                  {/* Dynamiczne pola w zależności od metody */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 min-h-[100px] flex flex-col justify-center">
                    {paymentMethod === 'blik' && (
                      <div className="text-center">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Wpisz kod BLIK</label>
                        <input type="text" maxLength="6" value={blikCode} onChange={(e) => setBlikCode(e.target.value.replace(/\D/g, ''))} className="w-32 text-center text-2xl tracking-widest p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none" placeholder="000000" />
                      </div>
                    )}
                    {paymentMethod === 'przelew' && (
                      <div className="text-center text-gray-600 text-sm">
                        Zostaniesz przekierowany do strony swojego banku po kliknięciu "Zapłać".
                      </div>
                    )}
                    {paymentMethod === 'karta' && (
                      <div className="space-y-3">
                        <input type="text" placeholder="Numer karty" className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none" />
                        <div className="flex gap-2">
                          <input type="text" placeholder="MM/RR" className="w-1/2 p-2 border border-gray-300 rounded focus:border-blue-500 outline-none" />
                          <input type="text" placeholder="CVC" className="w-1/2 p-2 border border-gray-300 rounded focus:border-blue-500 outline-none" />
                        </div>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 cursor-pointer text-lg">
                    Zapłać {ticketToPay.cena_laczna.toFixed(2)} PLN
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL MOJE BILETY --- */}
      {isMyTicketsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setIsMyTicketsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-2xl font-bold cursor-pointer">×</button>
            <h2 className="text-3xl font-black text-gray-900 mb-6 border-b pb-4">Twoje Bilety</h2>
            {mojeBilety.length === 0 ? (
              <div className="text-center text-gray-500 py-10">Nie masz jeszcze żadnych kupionych biletów.</div>
            ) : (
              <div className="space-y-4">
                {mojeBilety.map((bilet, idx) => (
                  <div key={idx} className="border-2 border-dashed border-gray-300 p-4 rounded-xl flex justify-between items-center bg-green-50">
                    <div>
                      <div className="font-bold text-lg text-gray-800">Podróż: {bilet.typ === 'BEZPOSREDNI' ? 'Bezpośrednia' : 'Łączona (Przesiadka)'}</div>
                      <div className="text-sm text-gray-600">Ilość etapów: {bilet.kursy.length}</div>
                      <div className="text-xs font-mono text-gray-400 mt-2">ID Transakcji: #TXN-{Math.floor(Math.random() * 10000)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-black text-xl mb-1">OPŁACONY</div>
                      <div className="font-bold text-gray-800">{bilet.cena_laczna.toFixed(2)} PLN</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modale logowania i rejestracji (skrócone dla czytelności, identyczne jak miałeś) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-xl font-bold cursor-pointer">X</button>
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Witaj ponownie!</h2>
            <form onSubmit={handleZalogujSubmit} className="space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Login</label><input type="text" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" placeholder="Twój login" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Hasło</label><input type="password" value={hasloInput} onChange={(e) => setHasloInput(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" placeholder="••••••••" /></div>
              <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer">Zaloguj się</button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500">Nie masz konta? <button onClick={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }} className="text-orange-600 font-bold hover:underline cursor-pointer">Zarejestruj się</button></div>
          </div>
        </div>
      )}

      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setIsRegisterModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-xl font-bold cursor-pointer">X</button>
            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Dołącz do TransitHub</h2>
            <form onSubmit={handleRejestracjaSubmit} className="space-y-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Wybierz Login</label><input type="text" value={regLogin} onChange={(e) => setRegLogin(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" placeholder="np. marcin99" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Adres Email</label><input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" placeholder="twoj@email.com" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Hasło</label><input type="password" value={regHaslo} onChange={(e) => setRegHaslo(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" placeholder="••••••••" /></div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer">Załóż konto</button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500">Masz już konto? <button onClick={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }} className="text-orange-600 font-bold hover:underline cursor-pointer">Zaloguj się</button></div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;