import React, { useState } from "react";
import { Menu, X, LogOut, User, Home, Trophy, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

import EventiTornei from "./EventiTornei";
import MarketplaceAdmin from "./MarketplaceAdmin";
import Profilo from "./Profilo";

export default function DashboardAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
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
              Benvenuto Admin
            </h2>
            <p className="text-gray-600">Usa il menu per gestire la piattaforma.</p>
          </div>
        );
      case "eventi":
        return <EventiTornei user={user} />;
      case "marketplace":
        return <MarketplaceAdmin />;
      case "profilo":
        return <Profilo user={user} />;
      default:
        return <div>Sezione non trovata</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      {/* HEADER */}
      <header className="w-full bg-white shadow flex items-center justify-between px-5 py-3">
        <h1 className="text-lg font-semibold text-gray-800">
          Dashboard Admin - {user?.email}
        </h1>
        {/* Bottone hamburger in alto a destra */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="text-gray-700 focus:outline-none"
        >
          {openMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* MENU A SCOMPARSA */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          openMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Benvenuto {user?.email}</h2>
        </div>

        <nav className="p-4 space-y-3 text-gray-700">
          <button
            className="w-full flex items-center space-x-3 p-3 rounded hover:bg-gray-200"
            onClick={() => { setActiveSection("home"); setOpenMenu(false); }}
          >
            <Home size={20} />
            <span>Home</span>
          </button>

          <button
            className="w-full flex items-center space-x-3 p-3 rounded hover:bg-gray-200"
            onClick={() => { setActiveSection("eventi"); setOpenMenu(false); }}
          >
            <Trophy size={20} />
            <span>Eventi & Tornei</span>
          </button>

          <button
            className="w-full flex items-center space-x-3 p-3 rounded hover:bg-gray-200"
            onClick={() => { setActiveSection("marketplace"); setOpenMenu(false); }}
          >
            <ShoppingBag size={20} />
            <span>Marketplace</span>
          </button>

          <button
            className="w-full flex items-center space-x-3 p-3 rounded hover:bg-gray-200"
            onClick={() => { setActiveSection("profilo"); setOpenMenu(false); }}
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
      <main className="flex-grow p-6 transition-all duration-300">
        {renderSection()}
      </main>
    </div>
  );
}
