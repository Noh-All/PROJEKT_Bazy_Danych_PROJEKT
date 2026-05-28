import React, { useState } from 'react';

function DriverPortal() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('skaner');
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);

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
      alert("Brak dostępu lub błędne dane!");
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl w-full max-w-sm space-y-4 shadow-2xl">
          <h2 className="text-2xl font-black text-center text-gray-900">Logowanie Kierowcy</h2>
          <input type="text" onChange={(e) => setLogin(e.target.value)} placeholder="Login" className="w-full p-4 border rounded-xl" required />
          <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Hasło" className="w-full p-4 border rounded-xl" required />
          <button className="w-full bg-yellow-500 py-4 rounded-xl font-bold hover:bg-yellow-600 transition">ZALOGUJ</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-gray-900 text-white text-center">
            <h1 className="text-2xl font-black text-yellow-500">TERMINAL {user.login}</h1>
        </div>
        
        <div className="flex border-b">
          <button onClick={() => setActiveTab('skaner')} className={`flex-1 py-4 font-bold ${activeTab === 'skaner' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-200'}`}>📷 Skaner QR</button>
          <button onClick={() => setActiveTab('usterki')} className={`flex-1 py-4 font-bold ${activeTab === 'usterki' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-200'}`}>🔧 Usterki</button>
        </div>

        <div className="p-8">
          {activeTab === 'skaner' ? (
            <form onSubmit={handleScan} className="space-y-4">
              <input type="text" value={scanInput} onChange={(e) => setScanInput(e.target.value)} placeholder="Wklej ciąg QR..." className="w-full p-4 border-2 rounded-xl font-mono text-center" required />
              <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold">WERYFIKUJ BILET</button>
              {scanResult && <div className={`p-4 rounded-xl text-center font-bold ${scanResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{scanResult.message}</div>}
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <h2 className="font-bold text-lg">Zgłoś usterkę</h2>
              <textarea placeholder="Opis..." className="w-full p-4 border rounded-xl h-32"></textarea>
              <button onClick={() => alert("Usterka wysłana!")} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold">WYŚLIJ ZGŁOSZENIE</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DriverPortal;