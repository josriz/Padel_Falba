// src/components/HamburgerMenu.jsx - SEMPRE TOP-RIGHT
import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Menu, X, Home, Trophy, User, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Trophy, label: 'Tornei', path: '/tornei' },
    { icon: User, label: 'Profilo', path: '/profilo' },
  ];

  return (
    <>
      {/* ✅ HAMBURGER BUTTON SEMPRE TOP-RIGHT */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 p-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 hover:shadow-xl hover:bg-white transition-all duration-300 md:hidden lg:flex"
        aria-label="Menu"
      >
        <Menu className="w-7 h-7 text-gray-800" />
      </button>

      {/* ✅ MENU MOBILE + DESKTOP OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Header Menu */}
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  🎾 Padel Tracker
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X className="w-7 h-7 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2 mb-8">
                {menuItems.map(({ icon: Icon, label, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-4 p-4 rounded-2xl font-semibold text-lg transition-all group ${
                      location.pathname === path
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'hover:bg-indigo-50 text-gray-800 hover:text-emerald-700'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className={`w-6 h-6 ${location.pathname === path ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-700'}`} />
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Admin Badge */}
              {isAdmin && (
                <div className="absolute top-28 right-4 p-3 bg-emerald-600/90 text-white rounded-2xl shadow-lg border-2 border-emerald-500 animate-pulse">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-bold text-sm">ADMIN</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
