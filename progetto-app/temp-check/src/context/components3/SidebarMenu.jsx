import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';

export default function SidebarMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', path: user?.isAdmin ? '/admin' : '/user' },
    { icon: '📅', label: 'Eventi', path: '/events' },
    { icon: '🛒', label: 'Marketplace', path: '/marketplace' },
    { icon: '👤', label: 'Profilo', path: '/profile' },
    ...(user?.isAdmin ? [{ icon: '👥', label: 'Utenti', path: '/admin/users' }] : []),
    { icon: '⚙️', label: 'Impostazioni', path: '/settings' }
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* HEADER */}
      <div className="mb-8 pb-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">🎾</span>
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">JR4C Padel</h2>
            <p className="text-sm text-gray-600">Gestione Tornei</p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-2 mb-8">
        {menuItems.map(({ icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all group"
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* USER INFO */}
      <div className="pt-6 border-t">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
          <div>
            <p className="font-semibold text-sm">{user?.email?.split('@')[0]}</p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.isAdmin ? 'Amministratore' : 'Giocatore'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all"
        >
          🚪 Esci
        </button>
      </div>
    </div>
  );
}
