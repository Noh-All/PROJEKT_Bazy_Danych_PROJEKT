import { useState } from 'react'

function App() {
  // Tutaj przechowujemy to, co użytkownik wpisze w formularz
  const [skad, setSkad] = useState('')
  const [dokad, setDokad] = useState('')
  const [data, setData] = useState('')

  // Ta funkcja uruchomi się po kliknięciu "Szukaj połączeń"
  const handleSearch = (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony
    alert(`Szukam trasy: ${skad} -> ${dokad} na dzień ${data}`);
    // Tu w Fazie 3 podepniemy prawdziwe zapytanie do bazy Kamila
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* --- PASEK NAWIGACJI (NAVBAR) --- */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">TransitHub</h1>
          <div className="space-x-6">
            <a href="#" className="hover:text-blue-200 transition">Rozkład jazdy</a>
            <a href="#" className="hover:text-blue-200 transition">Moje bilety</a>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
              Zaloguj się
            </button>
          </div>
        </div>
      </nav>

      {/* --- GŁÓWNA SEKCJA (HERO & FORMULARZ) --- */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-600 to-gray-50">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white mb-4 shadow-sm">
            Wygodne podróże na wyciągnięcie ręki
          </h2>
          <p className="text-blue-100 text-lg">
            Kupuj bilety online, sprawdzaj trasy i podróżuj bez stresu.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl">
          <form onSubmit={handleSearch} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pole: Skąd */}
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
              
              {/* Pole: Dokąd */}
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
            
            {/* Pole: Data */}
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

            {/* Przycisk wyszukiwania */}
            <button 
              type="submit" 
              className="w-full mt-4 bg-orange-500 text-white font-bold text-lg py-4 rounded-lg hover:bg-orange-600 transform hover:scale-[1.02] transition-all shadow-md"
            >
              Znajdź połączenie
            </button>

          </form>
        </div>
      </main>

    </div>
  )
}

export default App