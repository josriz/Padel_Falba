// src/components/Header.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <header className="flex justify-between items-center p-4 bg-indigo-600 text-white">
      <div className="text-lg font-bold">Padel Club</div>
      <div className="relative">
        <button
          className="p-2 rounded hover:bg-indigo-500"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776;
        </button>
        {menuOpen && (
          <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-48">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profilo</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link to="/settings" onClick={() => setMenuOpen(false)}>Impostazioni</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
