import React, { useState } from "react";
import { Menu, X, LogOut, User, Home, Trophy, ShoppingBag, Plus } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

import EventiTornei from "./EventiTornei";
import MarketplaceUser from "./MarketplaceUser";
import Profilo from "./Profilo";

export default function DashboardUser() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Benvenuto {user?.email}
            </h2>
            <p className="text-gray-600">Usa il menu per esplorare le funzionalità.</p>
          </div>
        );
      case "eventi":
        return <EventiTornei user={user} />;
      case "marketplace":
        return <MarketplaceUser user={user} />; // 🔑 Passaggio corretto
      case "profilo":
        return <Profilo user={user} />;
      default:
        return <div>Sezione non trovata</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER con bottone hamburger */}
      <header className="w-full bg-white shadow flex items-center justify-between px-5 py-3">
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* MENU A SCOMPARSA */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Benvenuto {user?.email}</h2>
        </div>

        <nav className="p-4 flex flex-col space-y-3 text-gray-700">
          <button
            className="flex items-center space-x-3 p-3 rounded hover:bg-gray-200"
            onClick={() => { setActiveSection("home"); setIsOpen(false); }}
          >
            <Home size={20} />
            <span>Home</span>
          </button>

          <button
            className="flex items-center space-x-3 p-3 rounded hover:bg-gray-200"
            onClick={() => { setActiveSection("eventi"); setIsOpen(false); }}
          >
            <Trophy size={20} />
            <span>Tornei & Eventi</span>
          </button>

          <button
            className="flex items-center space-x-3 p-3 rounded hover:bg-gray-200"
            onClick={() => { setActiveSection("marketplace"); setIsOpen(false); }}
          >
            <ShoppingBag size={20} />
            <span>Marketplace</span>
          </button>

          <button
            className="flex items-center space-x-3 p-3 rounded hover:bg-gray-200"
            onClick={() => { setActiveSection("profilo"); setIsOpen(false); }}
          >
            <User size={20} />
            <span>Profilo</span>
          </button>
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-600 font-semibold w-full p-3 hover:bg-red-100 rounded"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* CONTENUTO */}
      <main className="p-6 transition-all duration-300">
        {renderSection()}
      </main>
    </div>
  );
}
