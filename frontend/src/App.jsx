import { useState } from 'react'

function App() {
  const [skad, setSkad] = useState('')
  const [dokad, setDokad] = useState('')
  const [data, setData] = useState('')
  
  // NOWOŚĆ: Stan przechowujący wyniki wyszukiwania (na razie pusta lista)
  const [wyniki, setWyniki] = useState([])

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Zamiast alertu, symulujemy pobranie danych z bazy Kamila!
    // Wrzucamy do "wyników" dwa przykładowe połączenia:
    setWyniki([
      { id: 1, odjazd: '08:00', przyjazd: '10:30', przewoznik: 'TransitExpress', cena: '45 PLN' },
      { id: 2, odjazd: '11:15', przyjazd: '14:00', przewoznik: 'InterCity Bus', cena: '55 PLN' },
      { id: 3, odjazd: '15:30', przyjazd: '17:45', przewoznik: 'Polskie Linie', cena: '39 PLN' }
    ]);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Pasek Nawigacji */}
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

      {/* Główna sekcja */}
      <main className="grow flex flex-col items-center p-6 bg-linear-to-b from-blue-600 to-gray-50">
        
        {/* Tekst powitalny */}
        <div className="text-center mt-10 mb-10">
          <h2 className="text-4xl font-extrabold text-white mb-4 shadow-sm">
            Wygodne podróże na wyciągnięcie ręki
          </h2>
          <p className="text-blue-100 text-lg">
            Kupuj bilety online, sprawdzaj trasy i podróżuj bez stresu.
          </p>
        </div>

        {/* Formularz */}
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

        {/* NOWOŚĆ: Sekcja wyników wyszukiwania (pojawia się tylko, gdy są wyniki) */}
        {wyniki.length > 0 && (
          <div className="w-full max-w-3xl space-y-4 pb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Dostępne połączenia:</h3>
            
            {/* Mapowanie (wypisywanie) wyników na ekran */}
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
    </div>
  )
}

export default App