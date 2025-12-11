// src/components/LayoutProvider.jsx - ✅ MENU VERTICALE STRETTO (NO BANDA BIANCA!)
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

          {/* ✅ FIX BANDA BIANCA - MENU VERTICALE STRETTO! */}
          {isOpen && (
            <>
              {/* Overlay nero */}
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Menu verticale 288px stretto */}
              <div className="fixed top-20 left-6 w-72 h-[calc(100vh-5rem)] bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 overflow-hidden">
                {/* Header menu con X */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                
                {/* Menu items */}
                <nav className="p-6 space-y-2 overflow-y-auto h-[calc(100%-3rem)]">
                  {menuItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl font-medium transition-all group hover:bg-slate-50 border-l-4 ${
                        activeSection === item.section
                          ? 'bg-slate-50 border-blue-500 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:text-slate-900 border-transparent hover:border-slate-200'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </>
          )}
        </header>

        <main className="pt-2 max-w-6xl mx-auto px-6 pb-12">
          {children}
        </main>
      </div>
    </LayoutContext.Provider>
  );
}
