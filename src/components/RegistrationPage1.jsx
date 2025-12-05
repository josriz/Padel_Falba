// src/components/RegistrationPage.jsx - PROFESSIONALE!
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { UserPlus, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

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
          data: { role: 'user' } // profile role
        }
      });

      if (error) throw error;

      if (data.user) {
        alert('Registrazione completata! Controlla la tua email per verificare l\'account.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Errore nella registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-4xl shadow-2xl border border-white/50 p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <UserPlus className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Registrati
          </h1>
          <p className="text-xl text-gray-600">Crea il tuo account PadelClub</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-3xl mb-8 text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-500" />
              Email
            </label>
            <input
              type="email"
              placeholder="tuo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-5 border-2 border-gray-200 rounded-3xl text-lg focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              Password
            </label>
            <input
              type="password"
              placeholder="Minimo 8 caratteri"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-6 py-5 border-2 border-gray-200 rounded-3xl text-lg focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black text-xl rounded-3xl shadow-xl hover:shadow-2xl hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creazione account...
              </>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6" />
                Registrati Gratis
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-10 text-center">
          <p className="text-lg text-gray-600">
            Già registrato?{' '}
            <a href="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
              Accedi ora
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
