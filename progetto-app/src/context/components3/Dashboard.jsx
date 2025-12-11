import React, { useState, useEffect } from "react";
import { 
  Menu, X, LogOut, Home, Calendar, Trophy, ShoppingBag, User, Bell, Search, ChevronDown, 
  Settings, BarChart3, Users, Activity, CreditCard, Package 
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import MarketplaceList from "./MarketplaceList";
import EventiTornei from "./EventiTornei";
import Profilo from "./Profilo";

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [notifications, setNotifications] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Stats mock data per dashboard home
  const stats = [
    { title: "Tornei Iscritti", value: "3", change: "+2", color: "green" },
    { title: "Prenotazioni Settimana", value: "12", change: "-1", color: "blue" },
    { title: "Partite Giocate", value: "47", change: "+8", color: "purple" },
    { title: "Punti Marketplace", value: "€245", change: "+45", color: "orange" }
  ];

  const menuItems = [
    { key: "home", label: "Dashboard", icon: <Home size={20} />, adminOnly: false },
    { key: "eventi", label: "Eventi & Tornei", icon: <Trophy size={20} />, adminOnly: false },
    { key: "prenotazioni", label: "Prenotazioni", icon: <Calendar size={20} />, adminOnly: false },
    { key: "marketplace", label: "Marketplace", icon: <ShoppingBag size={20} />, adminOnly: false },
    { key: "profilo", label: "Profilo", icon: <User size={20} />, adminOnly: false },
    ...(isAdmin ? [
      { key: "stats", label: "Statistiche", icon: <BarChart3 size={20} />, adminOnly: true },
      { key: "utenti", label: "Utenti", icon: <Users size={20} />, adminOnly: true }
    ] : [])
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-8">
            {/* WELCOME HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Benvenuto!</h1>
                <p className="text-xl text-gray-600">{user?.email}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <Activity size={18} />
                  <span>Online</span>
                </div>
                <button className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <Bell size={20} />
                </button>
              </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color === 'green' ? 'from-green-400 to-green-500' : stat.color === 'blue' ? 'from-blue-400 to-blue-500' : stat.color === 'purple' ? 'from-purple-400 to-purple-500' : 'from-orange-400 to-orange-500'} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all`}>
                      {stat.icon || <BarChart3 size={20} className="text-white" />}
                    </div>
                    <span className={`text-sm font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-6">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-600 mt-1">{stat.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl text-white shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group">
                <Trophy size={48} className="mx-auto mb-4 opacity-90 group-hover:opacity-100" />
                <h3 className="text-2xl font-bold mb-2">Nuovo Torneo</h3>
                <p className="opacity-90">Organizza il prossimo evento</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl text-white shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group">
                <Calendar size={48} className="mx-auto mb-4 opacity-90 group-hover:opacity-100" />
                <h3 className="text-2xl font-bold mb-2">Prenota Campo</h3>
                <p className="opacity-90">Scegli il tuo orario preferito</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-3xl text-white shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-90 group-hover:opacity-100" />
                <h3 className="text-2xl font-bold mb-2">Marketplace</h3>
                <p className="opacity-90">Compra e vendi attrezzatura</p>
              </div>
            </div>
          </div>
        );
      case "eventi": return <EventiTornei />;
      case "prenotazioni": 
        return (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold">📅 Prenotazioni Campo</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Calendario Settimana</h3>
                <div className="grid grid-cols-7 gap-3 text-sm">
                  {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(day => (
                    <div key={day} className="p-3 bg-gray-50 rounded-xl text-center font-semibold">{day}</div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 bg-gradient-to-r from-emerald-500 to-green-600 p-10 rounded-3xl text-white text-center shadow-2xl">
                <h3 className="text-3xl font-bold mb-8">Prenota il tuo campo!</h3>
                <select className="w-full p-4 mb-6 text-xl rounded-2xl bg-white/20 backdrop-blur">
                  <option>Campo 1 - Centrale</option>
                  <option>Campo 2 - Laterale</option>
                </select>
                <button className="w-full bg-white text-green-600 py-6 px-8 rounded-3xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all">
                  ✅ CONFERMA PRENOTAZIONE
                </button>
              </div>
            </div>
          </div>
        );
      case "marketplace": return <MarketplaceList />;
      case "profilo": return <Profilo />;
      case "stats":
        return <div className="p-12"><h1 className="text-4xl font-bold">📊 Statistiche Admin</h1></div>;
      case "utenti":
        return <div className="p-12"><h1 className="text-4xl font-bold">👥 Gestione Utenti</h1></div>;
      default: return <div>Sezione non trovata</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* TOPBAR COMPLETA */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* LEFT: LOGO + SEARCH */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setOpenMenu(!openMenu)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                {openMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-gray-900">PadelClub</h1>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
            </div>

            {/* CENTER: SEARCH */}
            <div className="hidden md:flex flex-1 max-w-md mx-12">
              <div className="relative w-full">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca tornei, prenotazioni..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-white/50 backdrop-blur border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* RIGHT: NOTIFICATIONS + USER */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-2xl hover:bg-gray-100 transition-all">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notifications}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-2xl transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-gray-900 text-sm">{user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'Giocatore'}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR AVANZATA */}
      <aside className={`fixed lg:static inset-0 z-40 bg-white/90 backdrop-blur-xl shadow-2xl transform transition-all duration-300 lg:translate-x-0 ${
        openMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } lg:w-72 h-screen overflow-y-auto`}>
        <div className="p-8">
          <button 
            onClick={() => setOpenMenu(false)}
            className="lg:hidden mb-8 p-2 rounded-2xl hover:bg-gray-100"
          >
            <X size={24} />
          </button>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 ${
                  activeSection === item.key 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => {
                  setActiveSection(item.key);
                  setOpenMenu(false);
                }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  activeSection === item.key 
                    ? 'bg-white/20 backdrop-blur' 
                    : 'group-hover:bg-indigo-100 group-hover:scale-105'
                }`}>
                  {item.icon}
                </div>
                <span className="font-semibold text-left flex-1">{item.label}</span>
                {activeSection === item.key && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-4 p-4 text-red-600 hover:bg-red-50 rounded-2xl font-semibold transition-all group"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {openMenu && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setOpenMenu(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="lg:ml-72 p-8 max-w-7xl mx-auto w-full min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
}
