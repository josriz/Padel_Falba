// src/components/Profilo.jsx - ✅ PLAYTONIC STYLE + CONTENUTI EXTRA!
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { LogOut, User, Mail, Shield, Loader2, AlertCircle, Trophy, Zap, Calendar, MapPin, Phone, Star } from 'lucide-react';

const Profilo = ({ logout: propLogout }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);

  const handleLogout = async () => {
    if (propLogout) await propLogout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
        <div className="text-center bg-white/80 p-12 rounded-3xl shadow-2xl border border-gray-200 max-w-md backdrop-blur-xl">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6 drop-shadow-lg" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Login richiesto</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">Effettua il login per visualizzare il profilo PadelClub</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 pt-4 pb-12">
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* ✅ HERO HEADER PLAYTONIC */}
        <div className="text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-10 blur-xl"></div>
          <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl border-4 border-white relative ring-4 ring-indigo-100/50 group-hover:ring-emerald-100/50 transition-all">
            <User className="w-12 h-12 text-white drop-shadow-lg" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl animate-pulse opacity-75"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-emerald-700 bg-clip-text text-transparent mb-3 drop-shadow-lg">
            {user?.email?.split('@')[0]?.replace(/\./g, ' ') || 'Padel Player'}
          </h1>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 rounded-2xl backdrop-blur-sm shadow-xl border border-indigo-200 mb-8">
            <Mail className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-gray-900 truncate max-w-xs">{user?.email}</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
            <span className="px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-bold rounded-full shadow-sm">
              {isAdmin ? '👑 ADMINISTRATOR' : '🎾 PLAYER'}
            </span>
            <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-bold rounded-full shadow-sm">
              ID: {user?.id?.slice(0, 8)}...
            </span>
          </div>
        </div>

        {/* ✅ STATS CARDS ANIMATED */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white/80 p-6 rounded-3xl shadow-xl border border-indigo-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Tornei Partecipati</h3>
            <p className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">12</p>
            <p className="text-sm text-gray-600 text-center mt-1">Ultimo: Bari Open 2025</p>
          </div>

          <div className="group bg-white/80 p-6 rounded-3xl shadow-xl border border-emerald-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Punti PadelClub</h3>
            <p className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent text-center">1.247</p>
            <p className="text-sm text-emerald-700 text-center mt-1 font-semibold">+150 questo mese</p>
          </div>

          <div className="group bg-white/80 p-6 rounded-3xl shadow-xl border border-purple-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Ranking Puglia</h3>
            <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">#47</p>
            <p className="text-sm text-purple-700 text-center mt-1">Top 5% regionale</p>
          </div>
        </div>

        {/* ✅ INFO CARD PRINCIPALE */}
        <div className="bg-white/90 rounded-3xl shadow-2xl border border-indigo-200 p-8 backdrop-blur-xl hover:shadow-3xl transition-all hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Dettagli Account
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group p-6 bg-gradient-to-b from-indigo-50 to-white rounded-2xl border border-indigo-100 hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-gray-900">ID Unico</h4>
              </div>
              <p className="text-2xl font-black text-indigo-700">{user?.id?.slice(0, 8)}...</p>
            </div>

            <div className="group p-6 bg-gradient-to-b from-emerald-50 to-white rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Email Verificata</h4>
              </div>
              <p className="text-lg font-semibold text-emerald-700 truncate max-w-sm">{user?.email}</p>
            </div>

            <div className="group p-6 bg-gradient-to-b from-purple-50 to-white rounded-2xl border border-purple-100 hover:border-purple-200 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Membro dal</h4>
              </div>
              <p className="text-lg font-semibold text-purple-700">Novembre 2025</p>
            </div>

            <div className="group p-6 bg-gradient-to-b from-orange-50 to-white rounded-2xl border border-orange-100 hover:border-orange-200 transition-all md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Posizione</h4>
              </div>
              <p className="text-lg font-semibold text-orange-700">Bari, Puglia 🇮🇹</p>
            </div>

            <div className="group p-6 bg-gradient-to-b from-teal-50 to-white rounded-2xl border border-teal-100 hover:border-teal-200 transition-all md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-teal-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Contatti</h4>
              </div>
              <p className="text-lg font-semibold text-teal-700">WhatsApp disponibile</p>
            </div>
          </div>
        </div>

        {/* ✅ ADMIN PANEL EXTRA */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Shield className="w-10 h-10" />
              Admin Control Panel
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/30 transition-all">
                <h4 className="font-bold mb-2">Super Admin</h4>
                <p>Accesso totale sistema</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/30 transition-all">
                <h4 className="font-bold mb-2">Gestione Utenti</h4>
                <p>CRUD completo utenti</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/30 transition-all">
                <h4 className="font-bold mb-2">Analytics</h4>
                <p>Statistiche avanzate</p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ LOGOUT BUTTON PREMIUM */}
        <div className="pt-8 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center justify-center gap-4 py-4 px-8 bg-gradient-to-r from-red-500 via-red-600 to-orange-600 text-white font-black text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 border-0 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 group-hover:translate-x-2 transition-transform"></div>
            <LogOut className="w-6 h-6 relative group-hover:scale-110 transition-transform" />
            <span className="relative tracking-wide">Esci dal Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profilo;
