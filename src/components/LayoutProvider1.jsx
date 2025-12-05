// src/components/LayoutProvider.jsx - MENU ATTIVO PER OGNI PAGINA
import React, { useState, createContext, useContext } from 'react';
import { Menu, X, Home, Calendar, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { useLocation } from 'react-router-dom';

const LayoutContext = createContext();

export function useLayout() {
  return useContext(LayoutContext);
}

export default function LayoutProvider({ children }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // ✅ DETERMINA SEZIONE ATTIVA DALL'URL
  const getActiveSection = () => {
    if (location.pathname === '/dashboard' || location.pathname === '/') return 'home';
    if (location.pathname === '/tornei') return 'eventi';
    if (location.pathname === '/marketplace') return 'marketplace';
    if (location.pathname === '/profilo') return 'profilo';
    return 'home';
  };

  const activeSection = getActiveSection();

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home, path: '/dashboard', section: 'home' },
    { id: 'eventi', label: 'Eventi e Tornei', icon: Calendar, path: '/tornei', section: 'eventi' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, path: '/marketplace', section: 'marketplace' },
    { id: 'profilo', label: 'Profilo', icon: User, path: '/profilo', section: 'profilo' }
  ];

  return (
    <LayoutContext.Provider value={{ activeSection, setIsOpen }}>
      <div className="min-h-screen bg-white">
        {/* HEADER MINIMALISTA */}
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

              <h1 className="text-2xl font-light text-slate-800 absolute left-1/2 transform -translate-x-1/2">
                CieffePadel
              </h1>

              <div className="w-12 flex items-center justify-end">
                <button
                  onClick={logout}
                  className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="bg-white border-t border-slate-100 shadow-lg z-50 absolute top-full left-0 right-0">
              <div className="max-w-md mx-auto px-6 py-8">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.path}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl font-medium transition-all group hover:bg-slate-50 border-l-4 ${
                        activeSection === item.section
                          ? 'bg-slate-50 border-blue-500 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:text-slate-900 border-transparent hover:border-slate-200'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="pt-2 max-w-6xl mx-auto px-6 pb-12">
          {children}
        </main>
      </div>
    </LayoutContext.Provider>
  );
}
