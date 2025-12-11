// src/components/RegistrationPage.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { UserPlus, Mail, Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'user' }
        }
      });

      if (error) throw error;

      if (data.user) {
        alert('✅ Registrazione completata! Controlla la tua email per verificare l\'account.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Errore nella registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full hover:shadow-md transition-all hover:-translate-y-0.5">
        {/* ✅ HEADER IDENTICO DASHBOARD */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <UserPlus className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrati</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Crea il tuo account PadelClub
          </p>
        </div>

        {/* ✅ ERROR COMPATTO */}
        {error && (
          <div className="p-4 rounded-xl mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {/* ✅ FORM COMPATTO */}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              Email
            </label>
            <input
              type="email"
              placeholder="tuo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              Password
            </label>
            <input
              type="password"
              placeholder="Minimo 8 caratteri"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creazione account...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Registrati Gratis
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* ✅ LOGIN LINK COMPATTO */}
        <div className="pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Già registrato?{' '}
            <a href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Accedi ora
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
