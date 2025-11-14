import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-8" />
        <h1 className="font-bold text-lg">Cieffe Club</h1>
      </div>
      <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-2xl">☰</button>
      <div className={`sm:flex gap-4 ${menuOpen ? "block" : "hidden"} sm:block`}>
        <Link to="/">Dashboard</Link>
        <Link to="/eventi">Eventi</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/profilo">Profilo</Link>
        <button onClick={onLogout} className="text-red-300 hover:text-white">Logout</button>
      </div>
    </nav>
  );
}
