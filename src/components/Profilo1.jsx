// src/components/Profilo.jsx - ✅ COMPLETO CON LOGOUT
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { LogOut, User, Mail, Shield } from 'lucide-react';

const Profilo = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Profilo Utente
          </h1>
          
          {isAdmin && (
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold shadow-2xl mb-6">
              <Shield className="w-5 h-5 mr-2" />
              ADMIN PADEL MODE ATTIVO
            </div>
          )}
        </div>

        {/* Card Profilo */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 mb-8">
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mr-6 shadow-2xl">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user?.email || 'giose.rizzi@gmail.com'}</h2>
              <p className="text-xl text-gray-600 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                {isAdmin ? 'Amministratore' : 'Utente Standard'}
              </p>
            </div>
          </div>

          {/* Dettagli */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <User className="w-6 h-6 text-gray-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-500">ID Utente</p>
                <p className="font-bold text-gray-900">{user?.id || 'admin-bypass'}</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <Mail className="w-6 h-6 text-gray-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="font-bold text-indigo-600">{user?.email || 'giose.rizzi@gmail.com'}</p>
              </div>
            </div>
          </div>

          {/* ✅ LOGOUT BUTTON - SEZIONE PROFILO */}
          <div className="border-t pt-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform active:scale-95 gap-3 text-lg"
            >
              <LogOut className="w-6 h-6" />
              Esci dal Profilo (Logout)
            </button>
          </div>
        </div>

        {/* Stats Admin */}
        {isAdmin && (
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100">
              <div className="text-3xl font-bold text-emerald-600 mb-2">👑</div>
              <h3 className="text-lg font-bold mb-1">Admin Completo</h3>
              <p className="text-emerald-700 font-semibold">Accesso totale tornei</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">🎾</div>
              <h3 className="text-lg font-bold mb-1">Gestione Tornei</h3>
              <p className="text-blue-700 font-semibold">Creazione e modifica</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">📊</div>
              <h3 className="text-lg font-bold mb-1">Report Avanzati</h3>
              <p className="text-purple-700 font-semibold">Statistiche complete</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profilo;
