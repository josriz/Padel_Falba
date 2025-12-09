// src/components/Header.jsx - ✅ MENU VERTICALE STRETTO 280px (NO BANDA BIANCA!)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { Menu, X, Home, Calendar, Trophy, Users, LogOut, Shield } from 'lucide-react';

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Calendar, label: 'Prenotazioni', path: '/prenotazioni' },
    { icon: Trophy, label: 'Tornei', path: '/tornei' },
    { icon: Users, label: 'Profilo', path: '/profile' },
    ...(isAdmin ? [{ icon: Shield, label: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <>
      {/* ✅ HEADER FISSO */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors flex items-center"
          >
            🏓 PadelClub
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.slice(0, 3).map(({ icon: Icon, label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 font-medium transition-all hover:-translate-y-0.5"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* ✅ HAMBURGER MOBILE */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            {isMenuOpen ? (
              <X className="w-7 h-7 text-gray-700" />
            ) : (
              <Menu className="w-7 h-7 text-gray-700" />
            )}
          </button>
        </div>
      </header>

      {/* ✅ MENU VERTICALE STRETTO 280px - NO BANDA BIANCA! */}
      {isMenuOpen && (
        <>
          {/* Overlay nero trasparente */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={closeMenu}
          />
          
          {/* MENU VERTICALE SUPER STRETTO - SOLO 280px! */}
          <div className="fixed left-4 top-20 w-72 h-[calc(100vh-5rem)] bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 transform transition-all duration-300 ease-out md:hidden overflow-hidden">
            {/* Header X */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <button
                onClick={closeMenu}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all ml-auto"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* ✅ SOLO MENU VERTICALE - NO BANDA EXTRA! */}
            <div className="p-4 space-y-2 overflow-y-auto h-full">
              {menuItems.map(({ icon: Icon, label, path }) => (
                <button
                  key={label}
                  onClick={() => { navigate(path); closeMenu(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all group text-left"
                >
                  <Icon className="w-5 h-5 text-gray-500 group-hover:text-emerald-600 flex-shrink-0" />
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}

              {/* User section compatta */}
              {user && (
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-gray-900 truncate">{user.email}</p>
                      <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'User'}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    className="w-full flex items-center gap-3 p-3 bg-red-50 border-2 border-red-100 text-red-700 rounded-xl hover:bg-red-100 transition-all text-sm font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Esci</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
