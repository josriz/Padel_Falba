// src/components/Dashboard.jsx - ✅ MENU SOPRA TUTTO!
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, Calendar, User, LogOut, Shield, ShoppingBag, Trophy, Zap, Star } from 'lucide-react';

// Componenti esistenti
import ProfilePage from './ProfilePage';
import TournamentViewOnly from './TournamentViewOnly';
import TournamentListAndAdmin from './TournamentListAndAdmin';
import MarketplaceList from './MarketplaceList';
import MarketplaceGestion from './MarketplaceGestion';

export default function Dashboard() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [userStats, setUserStats] = useState({
    tournaments: 12,
    points: 1247,
    rank: 47,
    nextEvent: 'Bari Winter Cup - 15 Dic'
  });

  useEffect(() => {
    if (user) {
      const stats = {
        tournaments: 12 + Math.floor(Math.random() * 5),
        points: 1247 + Math.floor(Math.random() * 100),
        rank: Math.max(1, 47 - Math.floor(Math.random() * 3)),
        nextEvent: 'Bari Winter Cup - 15 Dic'
      };
      setUserStats(stats);
    }
  }, [user]);

  const menuItems = isAdmin ? [
    { id: 'home', label: 'Dashboard', icon: Home, section: 'home' },
    { id: 'admin', label: 'Gestione Tornei', icon: Shield, section: 'admin-tornei' },
    { id: 'eventi', label: 'Eventi e Tornei', icon: Calendar, section: 'tornei' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, section: 'marketplace-gestione' },
    { id: 'profilo', label: 'Profilo', icon: User, section: 'profilo' },
    { id: 'logout', label: 'Logout', icon: LogOut, section: 'logout' }
  ] : [
    { id: 'home', label: 'Dashboard', icon: Home, section: 'home' },
    { id: 'eventi', label: 'Eventi e Tornei', icon: Calendar, section: 'tornei' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, section: 'marketplace' },
    { id: 'profilo', label: 'Profilo', icon: User, section: 'profilo' },
    { id: 'logout', label: 'Logout', icon: LogOut, section: 'logout' }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const HomeOverview = () => (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl border-2 border-white relative">
          <Trophy className="w-10 h-10 text-white" />
          {isAdmin && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">ADMIN</div>}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Ciao <span className="text-emerald-600">{user?.email?.split('@')[0]?.replace(/\./g, ' ') || 'Giocatore'}</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">Le tue statistiche padel</p>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white/90 p-5 rounded-2xl shadow-md border border-emerald-100 hover:shadow-lg hover:-translate-y-1 transition-all group backdrop-blur-sm">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-105">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 text-center">{userStats.tournaments}</p>
          <p className="text-xs font-semibold text-gray-700 text-center uppercase tracking-wide">Tornei</p>
        </div>

        <div className="bg-white/90 p-5 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all group backdrop-blur-sm">
          <div className="w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-105">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-blue-700 text-center">{userStats.points.toLocaleString()}</p>
          <p className="text-xs font-semibold text-gray-700 text-center uppercase tracking-wide">Punti</p>
        </div>

        <div className="bg-white/90 p-5 rounded-2xl shadow-md border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all group backdrop-blur-sm">
          <div className="w-12 h-12 bg-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-105">
            <Star className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-purple-700 text-center">#{userStats.rank}</p>
          <p className="text-xs font-semibold text-gray-700 text-center uppercase tracking-wide">Rank Puglia</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 md:p-8 rounded-2xl text-center shadow-xl">
        <h3 className="text-lg md:text-xl font-bold mb-2">📅 {userStats.nextEvent}</h3>
        <p className="text-sm opacity-90 mb-4">Campo Centrale • Iscrizioni aperte</p>
        <button 
          onClick={() => setActiveSection('tornei')}
          className="px-6 py-2.5 bg-white text-emerald-700 font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          Dettagli →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <button 
          onClick={() => setActiveSection('tornei')}
          className="p-4 md:p-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-sm md:text-base"
        >
          🏆 Tornei
        </button>
        <button 
          onClick={() => setActiveSection('marketplace')}
          className="p-4 md:p-6 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-sm md:text-base"
        >
          🛒 Marketplace
        </button>
        <button 
          onClick={() => setActiveSection('profilo')}
          className="p-4 md:p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-sm md:text-base"
        >
          👤 Profilo
        </button>
      </div>
    </div>
  );

  const AccessDenied = () => (
    <div className="p-12 max-w-6xl mx-auto text-center">
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 md:p-12 shadow-md mx-auto max-w-sm border border-red-200">
        <Shield className="w-20 h-20 md:w-24 md:h-24 text-red-400 mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">Accesso Negato</h2>
        <p className="text-base md:text-lg text-red-500 mb-8">
          Questa sezione è riservata agli amministratori.
        </p>
        <button
          onClick={() => setActiveSection('home')}
          className="px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-xl shadow transition-all text-sm md:text-base"
        >
          ← Torna alla Dashboard
        </button>
      </div>
    </div>
  );

  const renderSection = () => {
    switch(activeSection) {
      case 'home': return <HomeOverview />;
      case 'tornei': return <TournamentViewOnly />;
      case 'admin-tornei': return isAdmin ? <TournamentListAndAdmin /> : <AccessDenied />;
      case 'marketplace': return <MarketplaceList />;
      case 'marketplace-gestione': return isAdmin ? <MarketplaceGestion /> : <AccessDenied />;
      case 'profilo': return <ProfilePage logout={handleLogout} />;
      case 'logout':
        handleLogout();
        return <div className="p-12 text-center text-green-700 bg-white/80 rounded-2xl shadow-md border border-green-200">Logout in corso...</div>;
      default: return <div className="p-12 text-center text-green-700 bg-white/80 rounded-2xl shadow-md border border-green-200">Sezione non trovata</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-200/50 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg md:rounded-xl hover:bg-green-50 transition-all group"
                aria-label="Menu"
              >
                {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6 text-green-700" /> : <Menu className="w-5 h-5 md:w-6 md:h-6 text-green-700" />}
              </button>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-green-700 absolute left-1/2 -translate-x-1/2 flex items-center">
              CieffePadel
              {isAdmin && (
                <span className="ml-2 px-2 py-1 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs md:text-sm font-bold rounded-full shadow">
                  ADMIN
                </span>
              )}
            </h1>

            <div className="w-12 md:w-0"></div>
          </div>
        </div>
      </header>

      {/* ✅ MENU FULLSCREEN SOPRA TUTTO - z-50! */}
      {isOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center pt-20 md:pt-24 pb-12 overflow-y-auto">
          <div className="w-full max-w-sm md:max-w-xs space-y-2 md:space-y-3 px-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.section);
                  setIsOpen(false);
                  if (item.id === 'logout') handleLogout();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-lg font-medium transition-all hover:bg-green-50 text-left text-sm md:text-base ${
                  activeSection === item.section ? 'bg-green-100 shadow-sm text-green-700 ring-2 ring-green-200' : 'text-green-700'
                } ${item.id === 'logout' ? 'text-red-600 font-bold hover:text-red-700 hover:bg-red-50' : ''}`}
              >
                <item.icon className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${item.id === 'logout' ? 'text-red-500' : 'text-green-600'}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="pt-2 pb-8 md:pb-12">{renderSection()}</main>
    </div>
  );
}
