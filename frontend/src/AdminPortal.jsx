import React, { useState, useEffect } from 'react';

function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('personel'); 
  const [usterki, setUsterki] = useState([]);
  const [raport, setRaport] = useState({ liczbaBiletow: 0, sumaZarobkow: 0 });
  const [raportTras, setRaportTras] = useState([]);

  // BAZY DANYCH (PERSONEL I AUTOBUSY)
  const [personelList, setPersonelList] = useState([]);
  const [autobusyList, setAutobusyList] = useState([]);

  // DODAWANIE PRACOWNIKA
  const [nowyLogin, setNowyLogin] = useState('');
  const [nowaRola, setNowaRola] = useState('');
  const [uprDodawanie, setUprDodawanie] = useState(false);
  const [uprRaporty, setUprRaporty] = useState(false);
  const [uprZmiany, setUprZmiany] = useState(false);

  // DODAWANIE AUTOBUSU
  const [nowaRejestracja, setNowaRejestracja] = useState('');
  const [nowyModel, setNowyModel] = useState('');
  const [nowaLiczbaMiejsc, setNowaLiczbaMiejsc] = useState('');

  // STANY TRAS I PRZYSTANKÓW
  const [przystanki, setPrzystanki] = useState([]);
  const [trasyBazy, setTrasyBazy] = useState([]);
  const [nowyPrzystanekNazwa, setNowyPrzystanekNazwa] = useState('');
  const [nowaTrasaNazwa, setNowaTrasaNazwa] = useState('');
  const [wybranePrzystanki, setWybranePrzystanki] = useState([]);
  const [wybieranyPrzystanekId, setWybieranyPrzystanekId] = useState('');

  // HARMONOGRAM KURSÓW
  const [kursIdTrasy, setKursIdTrasy] = useState('');
  const [kursIdKierowcy, setKursIdKierowcy] = useState('');
  const [kursIdAutobusu, setKursIdAutobusu] = useState('');
  const [kursDataOdjazdu, setKursDataOdjazdu] = useState('');
  const [kursCena, setKursCena] = useState('');
  const [zaplanowaneKursy, setZaplanowaneKursy] = useState([]);

  // GŁÓWNE POBIERANIE DANYCH
  useEffect(() => {
    pobierzPersonel();
    pobierzAutobusy();
    if (activeTab === 'flota') pobierzUsterki();
    if (activeTab === 'raporty') pobierzRaporty();
    if (activeTab === 'trasy' || activeTab === 'harmonogram') pobierzTrasyIPrzystanki();
    if (activeTab === 'harmonogram') pobierzKursy();
  }, [activeTab]);

  const pobierzPersonel = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/uzytkownicy');
      if (res.ok) setPersonelList(await res.json());
    } catch (err) {}
  };

  const pobierzAutobusy = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/autobusy');
      if (res.ok) setAutobusyList(await res.json());
    } catch (err) {}
  };

  const pobierzUsterki = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/usterki');
      if (res.ok) setUsterki(await res.json());
    } catch (err) {}
  };

  const pobierzRaporty = async () => {
    try {
      const res1 = await fetch('http://localhost:8080/api/raporty/podsumowanie');
      if (res1.ok) setRaport(await res1.json());
      const res2 = await fetch('http://localhost:8080/api/raporty/trasy');
      if (res2.ok) setRaportTras(await res2.json());
    } catch (err) {}
  };

  const pobierzTrasyIPrzystanki = async () => {
    try {
      const resP = await fetch('http://localhost:8080/api/przystanki');
      if (resP.ok) setPrzystanki(await resP.json());
      const resT = await fetch('http://localhost:8080/api/trasy');
      if (resT.ok) setTrasyBazy(await resT.json());
    } catch (err) {}
  };

  const pobierzKursy = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/kursy');
      if (res.ok) setZaplanowaneKursy(await res.json());
    } catch (err) {}
  };

  // --- USUWANIE REKORDÓW ---
  const handleUsunPracownika = async (id) => {
    if (!window.confirm("Na pewno usunąć tego pracownika?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/uzytkownicy/usun/${id}`, { method: 'DELETE' });
      if (res.ok) pobierzPersonel();
      else alert("Nie można usunąć! Użytkownik jest powiązany z kursami lub biletami.");
    } catch (err) { alert("Błąd połączenia."); }
  };

  const handleUsunAutobus = async (id) => {
    if (!window.confirm("Na pewno usunąć ten autobus?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/autobusy/usun/${id}`, { method: 'DELETE' });
      if (res.ok) pobierzAutobusy();
      else alert("Nie można usunąć! Autobus jest przypisany do kursu lub ma usterki.");
    } catch (err) { alert("Błąd połączenia."); }
  };

  const handleUsunTrase = async (id) => {
    if (!window.confirm("Na pewno usunąć tę trasę z systemu?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/trasy/usun/${id}`, { method: 'DELETE' });
      if (res.ok) pobierzTrasyIPrzystanki();
      else alert("Nie można usunąć! Do trasy są już przypisane kursy lub bilety.");
    } catch (err) { alert("Błąd połączenia."); }
  };

  // --- DODAWANIE AUTOBUSU ---
  const handleDodajAutobus = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/autobusy/dodaj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          numer_rejestracyjny: nowaRejestracja, 
          model: nowyModel, 
          liczba_miejsc: parseInt(nowaLiczbaMiejsc) 
        })
      });
      if (res.ok) {
        alert("Autobus dodany do floty!");
        setNowaRejestracja(''); setNowyModel(''); setNowaLiczbaMiejsc('');
        pobierzAutobusy();
      }
    } catch (err) { alert("Błąd połączenia z serwerem."); }
  };

  const handleNaprawUsterke = async (idUsterki) => {
    const res = await fetch(`http://localhost:8080/api/usterki/napraw?idUsterki=${idUsterki}`, { method: 'POST' });
    if (res.ok) pobierzUsterki(); 
  };

  const handleZmienCene = async (idKursu, obecnaCena) => {
    const nowaCena = prompt(`Obecna cena tego kursu to: ${obecnaCena} PLN.\nWpisz nową cenę:`, obecnaCena);
    if (!nowaCena || isNaN(nowaCena)) return;
    try {
      const res = await fetch(`http://localhost:8080/api/kursy/zmien-cene?idKursu=${idKursu}&nowaCena=${nowaCena}`, { method: 'POST' });
      if (res.ok) { alert("Cena zaktualizowana!"); pobierzKursy(); }
    } catch (err) { alert("Błąd połączenia."); }
  };

  const handleDodajPrzystanek = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/przystanki', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nazwa_miasta: nowyPrzystanekNazwa }) });
      if (res.ok) { setNowyPrzystanekNazwa(''); pobierzTrasyIPrzystanki(); }
    } catch (err) {}
  };

  const dodajPrzystanekDoKolejki = (e) => {
    e.preventDefault();
    if (!wybieranyPrzystanekId) return;
    const miasto = przystanki.find(p => p.id_przystanku.toString() === wybieranyPrzystanekId);
    if (miasto) setWybranePrzystanki([...wybranePrzystanki, miasto]);
  };

  const usunPrzystanekZKolejki = (index) => {
    const nowaLista = [...wybranePrzystanki];
    nowaLista.splice(index, 1);
    setWybranePrzystanki(nowaLista);
  };

  const handleDodajTrase = async (e) => {
    e.preventDefault();
    if (wybranePrzystanki.length < 2) return alert("Trasa musi składać się z min. 2 przystanków!");
    const idLista = wybranePrzystanki.map(p => p.id_przystanku).join(',');
    try {
      const url = `http://localhost:8080/api/trasy/dodaj?nazwaLinii=${encodeURIComponent(nowaTrasaNazwa)}&przystankiIds=${idLista}`;
      const res = await fetch(url, { method: 'POST' });
      if (res.ok) { setNowaTrasaNazwa(''); setWybranePrzystanki([]); pobierzTrasyIPrzystanki(); }
    } catch (err) {}
  };

  const handleDodajKurs = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:8080/api/kursy/dodaj?idTrasy=${kursIdTrasy}&idKierowcy=${kursIdKierowcy}&idAutobusu=${kursIdAutobusu}&dataOdjazdu=${kursDataOdjazdu}&cena=${kursCena}`;
      const res = await fetch(url, { method: 'POST' });
      if (res.ok) {
        alert("Kurs zaplanowany pomyślnie!");
        setKursIdTrasy(''); setKursIdKierowcy(''); setKursIdAutobusu(''); setKursDataOdjazdu(''); setKursCena('');
        pobierzKursy();
      }
    } catch (err) {}
  };

  const handleDodajPracownika = async (e) => {
    e.preventDefault();
    let uprawnieniaString = "BRAK";
    if (nowaRola === 'BIURO') {
      const upr = [];
      if (uprDodawanie) upr.push("DODAWANIE_KIEROWCOW"); if (uprRaporty) upr.push("RAPORTY"); if (uprZmiany) upr.push("ZMIANY_TRAS");
      uprawnieniaString = upr.join(", ");
    }
    try {
      const res = await fetch('http://localhost:8080/api/uzytkownicy/dodaj-pracownika', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login: nowyLogin, rola: nowaRola, uprawnienia: uprawnieniaString }) });
      if (res.ok) {
        const data = await res.json();
        alert(`✅ Konto utworzone.\nLogin: ${nowyLogin}\nHasło: ${data.haslo_startowe || 'start123'}`);
        setNowyLogin(''); setNowaRola(''); setUprDodawanie(false); setUprRaporty(false); setUprZmiany(false);
        pobierzPersonel();
      }
    } catch (err) {}
  };

  // --- LOGOWANIE ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/uzytkownicy/logowanie', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login, haslo: password }) });
      const data = await res.json();
      if (res.ok && data.sukces) { data.wymaga_zmiany_hasla ? setNeedsPasswordChange(true) : setIsLoggedIn(true); } 
      else alert("Błędny login lub hasło!");
    } catch (err) { alert("Błąd serwera."); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/uzytkownicy/zmien-haslo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login, nowe_haslo: newPassword }) });
      if (res.ok) { alert(`Sukces! Zaloguj się nowym hasłem.`); setNeedsPasswordChange(false); setPassword(''); setNewPassword(''); }
    } catch (err) {}
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-black text-center mb-6 text-blue-900">BackOffice Admin</h1>
          {!needsPasswordChange ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login admina" required className="w-full p-4 border rounded-xl" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło" required className="w-full p-4 border rounded-xl" />
              <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700">Zaloguj się</button>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl text-center mb-4 font-bold text-sm">Zmień hasło ze względów bezpieczeństwa.</div>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Wpisz nowe hasło" required className="w-full p-4 border border-yellow-400 rounded-xl" />
              <button className="w-full bg-yellow-500 font-bold py-4 rounded-xl">Zapisz hasło</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex pt-16">
      {/* MENU BOCZNE - NAPRAWIONE KOLORY */}
      <div className="w-64 bg-blue-900 text-white min-h-screen p-6 fixed left-0 top-0 pt-20">
        <h2 className="text-2xl font-black mb-8 text-blue-300">TransitHub<br/><span className="text-sm font-normal text-white">BackOffice</span></h2>
        <div className="space-y-2">
          <button onClick={() => setActiveTab('personel')} className={`w-full text-left p-3 rounded-lg font-bold ${activeTab === 'personel' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>👥 Baza i Personel</button>
          <button onClick={() => setActiveTab('flota')} className={`w-full text-left p-3 rounded-lg font-bold ${activeTab === 'flota' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>🚌 Flota i Usterki</button>
          <button onClick={() => setActiveTab('trasy')} className={`w-full text-left p-3 rounded-lg font-bold ${activeTab === 'trasy' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>🗺️ Trasy i Przystanki</button>
          <button onClick={() => setActiveTab('harmonogram')} className={`w-full text-left p-3 rounded-lg font-bold ${activeTab === 'harmonogram' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>🗓️ Harmonogram Kursów</button>
          <button onClick={() => setActiveTab('raporty')} className={`w-full text-left p-3 rounded-lg font-bold ${activeTab === 'raporty' ? 'bg-blue-700' : 'hover:bg-blue-800'}`}>📊 Raporty Biletowe</button>
        </div>
        <button onClick={() => {setIsLoggedIn(false); setLogin(''); setPassword('');}} className="mt-10 w-full bg-red-500 p-3 rounded-lg font-bold hover:bg-red-600">Wyloguj się</button>
      </div>

      <div className="flex-1 p-10 ml-64">
        
        {/* --- 1. PERSONEL I AUTOBUSY (ROZBUDOWANE) --- */}
        {activeTab === 'personel' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-gray-800">Zarządzanie Personelem i Flotą</h2>
            
            <div className="grid grid-cols-2 gap-8">
              {/* MODUŁ PRACOWNIKÓW */}
              <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-blue-600">
                <h3 className="text-xl font-bold mb-4">Pracownicy Systemu</h3>
                <form className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200" onSubmit={handleDodajPracownika}>
                  <p className="font-bold text-sm text-gray-600 uppercase">Dodaj Pracownika</p>
                  <input type="text" value={nowyLogin} onChange={(e) => setNowyLogin(e.target.value)} placeholder="Login (np. jan_k)" required className="w-full p-2 border rounded" />
                  <select value={nowaRola} onChange={(e) => setNowaRola(e.target.value)} className="w-full p-2 border rounded" required>
                    <option value="">Wybierz rolę...</option>
                    <option value="BIURO">Pracownik Biurowy</option>
                    <option value="KIEROWCA">Kierowca</option>
                  </select>
                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">+ Utwórz Konto</button>
                </form>

                <div className="max-h-64 overflow-y-auto border rounded-lg p-2 space-y-2 bg-gray-50">
                  {personelList
                    .filter(p => p.rola !== 'PASAZER') /* <--- ZMIANA: Filtr usuwający pasażerów z widoku */
                    .map(p => (
                    <div key={p.id_uzytkownika} className="bg-white p-3 border rounded shadow-sm flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800">{p.login}</p>
                        <span className={`text-xs px-2 py-1 rounded text-white ${p.rola === 'ADMIN' ? 'bg-red-500' : p.rola === 'BIURO' ? 'bg-blue-500' : 'bg-green-500'}`}>{p.rola}</span>
                      </div>
                      
                      {/* ZMIANA: Przycisk usuwania znika dla głównego admina */}
                      {p.login !== 'admin_glowny' ? (
                        <button onClick={() => handleUsunPracownika(p.id_uzytkownika)} className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-200 cursor-pointer">Usuń</button>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded border border-gray-200">Nietykalny</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* MODUŁ AUTOBUSÓW */}
              <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-purple-600">
                <h3 className="text-xl font-bold mb-4">Pojazdy we Flocie</h3>
                <form className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200" onSubmit={handleDodajAutobus}>
                  <p className="font-bold text-sm text-gray-600 uppercase">Dodaj Autobus</p>
                  <div className="flex gap-2">
                    <input type="text" value={nowaRejestracja} onChange={(e) => setNowaRejestracja(e.target.value)} placeholder="Rejestracja" required className="flex-1 p-2 border rounded" />
                    <input type="number" value={nowaLiczbaMiejsc} onChange={(e) => setNowaLiczbaMiejsc(e.target.value)} placeholder="Miejsca" required className="w-24 p-2 border rounded" />
                  </div>
                  <input type="text" value={nowyModel} onChange={(e) => setNowyModel(e.target.value)} placeholder="Model (np. Mercedes Sprinter)" required className="w-full p-2 border rounded" />
                  <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700">+ Dodaj Pojazd</button>
                </form>

                <div className="max-h-64 overflow-y-auto border rounded-lg p-2 space-y-2 bg-gray-50">
                  {autobusyList.map(a => (
                    <div key={a.id_autobusu} className="bg-white p-3 border rounded shadow-sm flex justify-between items-center">
                      <div>
                        <p className="font-black text-gray-800">{a.numer_rejestracyjny}</p>
                        <p className="text-xs text-gray-500">{a.model} (Miejsc: {a.liczba_miejsc})</p>
                      </div>
                      <button onClick={() => handleUsunAutobus(a.id_autobusu)} className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded border border-red-200">Usuń</button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- 2. USTERKI --- */}
        {activeTab === 'flota' && (
          <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-blue-600">
            <h3 className="text-2xl font-bold mb-6">Zgłoszone Usterki Floty</h3>
            <div className="space-y-4">
              {usterki.length === 0 ? <p className="text-gray-500">Brak zgłoszonych usterek w bazie.</p> : null}
              {usterki.map(usterka => (
                <div key={usterka.id_usterki} className={`p-4 rounded-lg flex justify-between items-center border ${usterka.czy_naprawiona ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded text-white ${usterka.czy_naprawiona ? 'bg-green-500' : 'bg-red-500'}`}>{usterka.czy_naprawiona ? 'NAPRAWIONE' : 'DO NAPRAWY'}</span>
                    <p className="font-bold mt-2">Autobus ID: {usterka.id_autobusu}</p>
                    <p className="text-sm text-gray-600">Opis: {usterka.opis}</p>
                  </div>
                  {!usterka.czy_naprawiona && (
                    <button onClick={() => handleNaprawUsterke(usterka.id_usterki)} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Oznacz jako naprawiony</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 3. TRASY (Z USUWANIEM) --- */}
        {activeTab === 'trasy' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-gray-800">Zarządzanie Trasami i Siecią</h2>
            <div className="grid grid-cols-2 gap-8">
              
              <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-yellow-500">
                <h3 className="text-xl font-bold mb-4">1. Baza Przystanków</h3>
                <form onSubmit={handleDodajPrzystanek} className="flex gap-2 mb-6">
                  <input type="text" value={nowyPrzystanekNazwa} onChange={(e) => setNowyPrzystanekNazwa(e.target.value)} placeholder="Nazwa miasta (np. Kraków)" required className="flex-1 p-3 border rounded-lg" />
                  <button type="submit" className="bg-yellow-500 font-bold px-6 rounded-lg text-white hover:bg-yellow-600">Dodaj</button>
                </form>
                <div className="max-h-64 overflow-y-auto border rounded-lg">
                  {przystanki.map(p => (
                    <div key={p.id_przystanku} className="p-3 border-b hover:bg-gray-50 flex justify-between">
                      <span className="font-bold text-gray-700">{p.nazwa_miasta}</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">ID: {p.id_przystanku}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-green-500">
                <h3 className="text-xl font-bold mb-4">2. Kompozytor Tras</h3>
                <form onSubmit={handleDodajTrase} className="space-y-4 mb-6">
                  <input type="text" value={nowaTrasaNazwa} onChange={(e) => setNowaTrasaNazwa(e.target.value)} placeholder="Nazwa linii (np. Linia 130)" required className="w-full p-3 border rounded-lg" />
                  <div className="bg-gray-50 p-4 border rounded-xl space-y-4">
                    <div className="flex gap-2">
                      <select value={wybieranyPrzystanekId} onChange={(e) => setWybieranyPrzystanekId(e.target.value)} className="flex-1 p-3 border rounded-lg bg-white">
                        <option value="">-- Wybierz przystanek --</option>
                        {przystanki.map(p => <option key={p.id_przystanku} value={p.id_przystanku}>{p.nazwa_miasta}</option>)}
                      </select>
                      <button onClick={dodajPrzystanekDoKolejki} type="button" className="bg-blue-600 text-white font-bold px-4 rounded-lg hover:bg-blue-700">+ Dodaj</button>
                    </div>
                    <div className="min-h-[60px] bg-white border border-dashed border-gray-300 rounded-lg p-3">
                      {wybranePrzystanki.map((p, index) => (
                        <div key={index} className="flex justify-between items-center bg-blue-50 border border-blue-100 p-2 mb-1 rounded">
                          <span className="font-bold text-sm text-blue-900">{index + 1}. {p.nazwa_miasta}</span>
                          <button type="button" onClick={() => usunPrzystanekZKolejki(index)} className="text-red-500 hover:text-red-700 text-xs font-bold">X</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600">Zapisz gotową trasę w bazie</button>
                </form>

                <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide mb-2">Aktywne Trasy (Kliknij X by usunąć)</h4>
                <div className="max-h-40 overflow-y-auto border rounded-lg space-y-1 p-2 bg-gray-50">
                  {trasyBazy.map(t => (
                    <div key={t.id_trasy} className="bg-white p-3 border rounded shadow-sm text-sm flex justify-between items-center">
                      <div>
                        <span className="font-black text-green-700">{t.nazwa_linii}</span>: <br/>
                        <span className="text-gray-600 text-xs">
                          {t.przystanekStart ? `${t.przystanekStart.nazwa_miasta}` : ''} ➔ {t.przystanekKoniec ? `${t.przystanekKoniec.nazwa_miasta}` : ''}
                        </span>
                      </div>
                      <button onClick={() => handleUsunTrase(t.id_trasy)} className="text-red-500 hover:text-white hover:bg-red-500 px-2 py-1 rounded font-bold border border-red-200 transition">X</button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- 4. HARMONOGRAM (W PEŁNI Z LISTAMI) --- */}
        {activeTab === 'harmonogram' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-gray-800">Planowanie Kursów i Cen</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-yellow-500">
                <h3 className="text-xl font-bold mb-4">Dodaj nowy Kurs</h3>
                <form onSubmit={handleDodajKurs} className="space-y-4">
                  
                  <div>
                    <label className="text-sm font-bold text-gray-600">1. Wybierz Trasę:</label>
                    <select value={kursIdTrasy} onChange={(e) => setKursIdTrasy(e.target.value)} required className="w-full p-3 border rounded-lg mt-1 bg-white">
                      <option value="">-- Wybierz zapisaną Trasę --</option>
                      {trasyBazy.map(t => <option key={t.id_trasy} value={t.id_trasy}>{t.nazwa_linii}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-bold text-gray-600">2. Wybierz Kierowcę:</label>
                      <select value={kursIdKierowcy} onChange={(e) => setKursIdKierowcy(e.target.value)} required className="w-full p-3 border rounded-lg mt-1 bg-white">
                        <option value="">-- Przypisz pracownika --</option>
                        {personelList.filter(u => u.rola === 'KIEROWCA').map(k => (
                          <option key={k.id_uzytkownika} value={k.id_uzytkownika}>{k.login}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-bold text-gray-600">3. Wybierz Autobus:</label>
                      <select value={kursIdAutobusu} onChange={(e) => setKursIdAutobusu(e.target.value)} required className="w-full p-3 border rounded-lg mt-1 bg-white">
                        <option value="">-- Z bazy pojazdów --</option>
                        {autobusyList.map(a => (
                          <option key={a.id_autobusu} value={a.id_autobusu}>{a.numer_rejestracyjny} ({a.model})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-bold text-gray-600">4. Data i Godzina:</label>
                      <input type="datetime-local" value={kursDataOdjazdu} onChange={(e) => setKursDataOdjazdu(e.target.value)} required className="w-full p-3 border rounded-lg mt-1" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-bold text-gray-600">5. Cena Biletu (PLN):</label>
                      <input type="number" step="0.01" value={kursCena} onChange={(e) => setKursCena(e.target.value)} placeholder="Np. 25.50" required className="w-full p-3 border border-green-500 bg-green-50 rounded-lg mt-1 font-bold text-green-700" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-600 shadow-md">Wpisz w Grafik</button>
                </form>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-blue-500">
                <h3 className="text-xl font-bold mb-4">Grafik Zaplanowanych Przejazdów</h3>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {zaplanowaneKursy.length === 0 && <p className="text-gray-500">Brak zaplanowanych kursów.</p>}
                  {zaplanowaneKursy.map(kurs => (
                    <div key={kurs.id_kursu} className="p-4 border rounded-lg bg-gray-50 flex flex-col gap-1 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-black text-blue-800 text-lg">{kurs.trasa ? kurs.trasa.nazwa_linii : 'Brak Trasy'}</span>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">{kurs.cena_bazowa} PLN</span>
                      </div>
                      <span className="text-sm text-gray-600">🗓️ {new Date(kurs.data_odjazdu).toLocaleString('pl-PL')}</span>
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                        <div className="flex gap-4 text-xs text-gray-500 font-bold uppercase">
                          <span>Kierowca: <span className="text-gray-800">{kurs.kierowca ? kurs.kierowca.login : '?'}</span></span>
                          <span>Bus: <span className="text-gray-800">{kurs.autobus ? kurs.autobus.numer_rejestracyjny : '?'}</span></span>
                        </div>
                        <button onClick={() => handleZmienCene(kurs.id_kursu, kurs.cena_bazowa)} className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg hover:bg-yellow-200 font-bold border border-yellow-300 transition">
                          ✏️ Edytuj Cenę
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 5. RAPORTY --- */}
        {activeTab === 'raporty' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-blue-600">
              <h3 className="text-2xl font-bold mb-6">Podsumowanie Sprzedaży</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center shadow-sm">
                  <p className="text-blue-800 font-bold mb-2">Sprzedane Bilety Łącznie</p>
                  <p className="text-4xl font-black text-blue-900">{raport.liczbaBiletow} szt.</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center shadow-sm">
                  <p className="text-green-800 font-bold mb-2">Całkowity Przychód Firmy</p>
                  <p className="text-4xl font-black text-green-900">{raport.sumaZarobkow} PLN</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-purple-600">
              <h3 className="text-2xl font-bold mb-6">Zarobki z poszczególnych tras</h3>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-bold text-gray-700">Zestawienie</th>
                      <th className="p-4 font-bold text-gray-700 text-center">Sprzedane Bilety</th>
                      <th className="p-4 font-bold text-gray-700 text-right">Przychód (PLN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {raportTras.length === 0 ? (
                      <tr><td colSpan="3" className="p-4 text-center text-gray-500">Brak danych o trasach.</td></tr>
                    ) : (
                      raportTras.map((trasa, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition">
                          <td className="p-4 font-bold text-gray-800">Trasa #{trasa.idTrasy}</td>
                          <td className="p-4 text-center font-bold text-blue-600">{trasa.liczbaBiletow} szt.</td>
                          <td className="p-4 text-right font-bold text-green-600">{trasa.przychod} zł</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminPortal;