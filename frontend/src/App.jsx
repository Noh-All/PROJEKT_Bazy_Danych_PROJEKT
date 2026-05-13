import { useState } from 'react'

function App() {
  // NOWOŚĆ: Stan decydujący o tym, która strona jest aktywna ('home' lub 'login')
  const [aktualnyWidok, setAktualnyWidok] = useState('home')

  // Stany dla strony głównej (wyszukiwarka)
  const [skad, setSkad] = useState('')
  const [dokad, setDokad] = useState('')
  const [data, setData] = useState('')
  const [wyniki, setWyniki] = useState([])

  // NOWOŚĆ: Stany dla formularza logowania
  const [email, setEmail] = useState('')
  const [haslo, setHaslo] = useState('')

  // Funkcja szukania połączeń
  const handleSearch = (e) => {
    e.preventDefault();
    setWyniki([
      { id: 1, odjazd: '08:00', przyjazd: '10:30', przewoznik: 'TransitExpress', cena: '45 PLN' },
      { id: 2, odjazd: '11:15', przyjazd: '14:00', przewoznik: 'InterCity Bus', cena: '55 PLN' },
      { id: 3, odjazd: '15:30', przyjazd: '17:45', przewoznik: 'Polskie Linie', cena: '39 PLN' }
    ]);
  }

  // Funkcja obsługująca logowanie
  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Próba logowania dla e-maila: ${email}`);
    // Po poprawnym zalogowaniu wrócimy na stronę główną:
    setAktualnyWidok('home');
    setEmail('');
    setHaslo('');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* --- PASEK NAWIGACJI (Zawsze widoczny) --- */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Kliknięcie w logo wraca na stronę główną */}
          <h1 
            className="text-2xl font-bold tracking-wider cursor-pointer hover:text-blue-200 transition"
            onClick={() => setAktualnyWidok('home')}
          >
            TransitHub
          </h1>
          <div className="space-x-6">
            <a href="#" className="hover:text-blue-200 transition">Rozkład jazdy</a>
            <a href="#" className="hover:text-blue-200 transition">Moje bilety</a>
            {/* Kliknięcie w przycisk zmienia widok na logowanie */}
            <button 
              onClick={() => setAktualnyWidok('login')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition cursor-pointer"
            >
              Zaloguj się
            </button>
          </div>
        </div>
      </nav>

      {/* --- WIDOK 1: STRONA GŁÓWNA (Wyszukiwarka) --- */}
      {aktualnyWidok === 'home' && (
        <main className="grow flex flex-col items-center p-6 bg-linear-to-b from-blue-600 to-gray-50">
          <div className="text-center mt-10 mb-10">
            <h2 className="text-4xl font-extrabold text-white mb-4 shadow-sm">
              Wygodne podróże na wyciągnięcie ręki
            </h2>
            <p className="text-blue-100 text-lg">
              Kupuj bilety online, sprawdzaj trasy i podróżuj bez stresu.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl mb-10">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Skąd odjeżdżasz?</label>
                  <input 
                    type="text" 
                    value={skad}
                    onChange={(e) => setSkad(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="np. Warszawa"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Dokąd jedziesz?</label>
                  <input 
                    type="text" 
                    value={dokad}
                    onChange={(e) => setDokad(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="np. Kraków"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Data wyjazdu</label>
                <input 
                  type="date" 
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full mt-4 bg-orange-500 text-white font-bold text-lg py-4 rounded-lg hover:bg-orange-600 transform hover:scale-[1.02] transition-all shadow-md cursor-pointer"
              >
                Znajdź połączenie
              </button>
            </form>
          </div>

          {wyniki.length > 0 && (
            <div className="w-full max-w-3xl space-y-4 pb-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Dostępne połączenia:</h3>
              {wyniki.map((trasa) => (
                <div key={trasa.id} className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center border-l-4 border-orange-500 hover:shadow-lg transition">
                  <div>
                    <div className="text-xl font-bold text-gray-800">
                      {trasa.odjazd} <span className="text-gray-400 font-normal mx-2">➔</span> {trasa.przyjazd}
                    </div>
                    <div className="text-gray-500 mt-1 text-sm">{trasa.przewoznik}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{trasa.cena}</div>
                    <button className="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-200 transition cursor-pointer">
                      Kup bilet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* --- WIDOK 2: LOGOWANIE --- */}
      {aktualnyWidok === 'login' && (
        <main className="grow flex items-center justify-center p-6 bg-gray-100">
          <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Witaj ponownie</h2>
            <p className="text-gray-500 text-center mb-8">Zaloguj się, aby zarządzać swoimi biletami</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Adres e-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="jan@kowalski.pl"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Hasło</label>
                <input 
                  type="password" 
                  value={haslo}
                  onChange={(e) => setHaslo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded text-blue-600 focus:ring-blue-500" />
                  Zapamiętaj mnie
                </label>
                <a href="#" className="text-blue-600 hover:underline font-medium">Zapomniałeś hasła?</a>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-md"
              >
                Zaloguj się
              </button>
            </form>
            
            <div className="mt-8 text-center text-sm text-gray-600">
              Nie masz jeszcze konta? <a href="#" className="text-orange-500 hover:underline font-bold">Zarejestruj się</a>
            </div>
          </div>
        </main>
      )}

    </div>
  )
}

export default App