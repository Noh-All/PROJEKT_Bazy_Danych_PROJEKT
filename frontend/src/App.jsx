import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import ClientPortal from './ClientPortal';
import AdminPortal from './AdminPortal';
import DriverPortal from './DriverPortal';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Funkcja, która zamyka menu, gdy klikniesz gdzieś indziej na ekranie
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <BrowserRouter>
      
      {/* ELEGANCKIE ROZWIJANE MENU NA GÓRZE (Zawsze widoczne, na środku) */}
      <div 
        ref={menuRef} 
        className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[9999]"
      >
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="bg-gray-900 text-white px-6 py-2 rounded-full shadow-lg font-black flex items-center gap-2 hover:bg-gray-800 transition border-2 border-gray-700 cursor-pointer"
        >
          ⚙️ TransitHUB Portale {isMenuOpen ? '▴' : '▾'}
        </button>

        {/* Ciało rozwijanego menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200 flex flex-col min-w-[200px]">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)} 
              className="px-4 py-3 hover:bg-orange-50 hover:text-orange-600 font-bold border-b border-gray-100 text-gray-700 transition flex items-center gap-2"
            >
              🧍 Panel Pasażera
            </Link>
            <Link 
              to="/kierowca" 
              onClick={() => setIsMenuOpen(false)} 
              className="px-4 py-3 hover:bg-yellow-50 hover:text-yellow-600 font-bold border-b border-gray-100 text-gray-700 transition flex items-center gap-2"
            >
              🚌 Terminal Kierowcy
            </Link>
            <Link 
              to="/admin" 
              onClick={() => setIsMenuOpen(false)} 
              className="px-4 py-3 hover:bg-blue-50 hover:text-blue-600 font-bold text-gray-700 transition flex items-center gap-2"
            >
              💼 BackOffice Admina
            </Link>
          </div>
        )}
      </div>

      <Routes>
        <Route path="/" element={<ClientPortal />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/kierowca" element={<DriverPortal />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;