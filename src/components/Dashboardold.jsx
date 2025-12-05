// src/components/Dashboard.jsx - MENU ADMIN DIVERSO!
import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, Calendar, ShoppingBag, User, Shield, Users } from 'lucide-react';

import Prenotazioni from './Prenotazioni';
import ProfilePage from './ProfilePage';
import MarketplaceGestion from './MarketplaceGestion';
import TournamentList from './TournamentList';
import TournamentListAndAdmin from './TournamentListAndAdmin';  // ✅ ADMIN COMPONENT

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();  // ✅ AGGIUNTO isAdmin
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // ✅ MENU DIVERSO PER ADMIN/UTENTE
  const menuItems = isAdmin ? [
    // ADMIN MENU (7 item)
    { id: 'home', label: 'Dashboard', icon: Home, section: 'home' },
    { id: 'admin-tornei', label: 'Gestione Tornei', icon: Shield, section: 'admin-tornei' },
    { id: 'eventi', label: 'Eventi e Tornei', icon: Calendar, section: 'tornei' },
    { id: 'iscritti', label: 'Iscritti Tornei', icon: Users, section: 'iscritti' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, section: 'marketplace' },
    { id: 'profilo', label: 'Profilo Admin', icon: User, section: 'profilo' }
  ] : [
    // UTENTE MENU (4 item originale)
    { id: 'home', label: 'Dashboard', icon: Home, section: 'home' },
    { id: 'eventi', label: 'Eventi e Tornei', icon: Calendar, section: 'tornei' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, section: 'marketplace' },
    { id: 'profilo', label: 'Profilo', icon: User, section: 'profilo' }
  ];

  // ✅ SEZIONI ADMIN DIVERSO
  const renderSection = () => {
    switch(activeSection) {
      case 'home': return <HomeOverview />;
      case 'tornei': return <TournamentList />;
      case 'marketplace': return <MarketplaceGestion />;
      case 'profilo': return <ProfilePage logout={logout} />;
      
      // ✅ NUOVE SEZIONI ADMIN
      case 'admin-tornei': return <TournamentListAndAdmin />;
      case 'iscritti': return (
        <div className="p-12 max-w-6xl mx-auto">
          <h1 className="text-4xl font-black mb-12 text-emerald-600">
            📋 Gestione Iscritti (Admin)
          </h1>
          <div className="bg-emerald-50 p-12 rounded-4xl text-center">
            <Users className="w-32 h-32 text-emerald-400 mx-auto mb-8" />
            <p className="text-2xl text-gray-600">
              Usa "Gestione Tornei" per vedere tutti gli iscritti!
            </p>
          </div>
        </div>
      );
      
      default: return <div className="p-12 text-center"><h2 className="text-2xl font-light text-slate-500">Sezione non trovata</h2></div>;
    }
  };

  // Home con BADGE ADMIN
  const HomeOverview = () => (
    <div className="p-12 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-28 h-28 bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg border relative">
          <Home className="w-12 h-12 text-slate-600" />
          {isAdmin && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
              ADMIN
            </div>
          )}
        </div>
        <h1 className="text-4xl font-light text-slate-900 mb-4">
          Benvenuto{isAdmin ? ' Admin' : ''}
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          {isAdmin 
            ? 'Gestisci tornei, iscritti e marketplace' 
            : 'Scegli una sezione dal menu'
          }
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER CON BADGE ADMIN */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-slate-50 transition-all group"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-slate-600 group-hover:text-slate-800" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600 group-hover:text-slate-800" />
              )}
            </button>

            <h1 className="text-2xl font-light text-slate-800 absolute left-1/2 transform -translate-x-1/2 flex items-center">
              CieffePadel
              {isAdmin && (
                <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-bold rounded-full">
                  ADMIN
                </span>
              )}
            </h1>

            <div className="w-12"></div>
          </div>
        </div>

        {/* MENU DINAMICO */}
        {isOpen && (
          <div className="bg-white border-t border-slate-100 shadow-lg z-50 absolute top-full left-0 right-0">
            <div className="max-w-md mx-auto px-6 py-8">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.section);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl font-medium transition-all group hover:bg-slate-50 border-l-4 ${
                      activeSection === item.section
                        ? 'bg-slate-50 border-blue-500 text-blue-700 font-semibold shadow-md'
                        : 'text-slate-700 hover:text-slate-900 border-transparent hover:border-slate-200'
                    } ${isAdmin && item.id === 'admin-tornei' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : ''}`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="pt-2">{renderSection()}</main>
    </div>
  );
}
