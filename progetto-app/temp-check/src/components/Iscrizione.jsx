// src/components/Iscrizione.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { UserPlus, Mail, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function Iscrizione({ torneoId }) {
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '' });
  const [message, setMessage] = useState({ type: null, text: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      // 1. Controllo email duplicata per questo torneo
      const { data: existing, error: err1 } = await supabase
        .from('tournament_players')
        .select('email')
        .eq('email', form.email)
        .eq('torneo_id', torneoId);

      if (err1) throw new Error('Errore controllo email: ' + err1.message);

      if (existing && existing.length > 0) {
        throw new Error('Email già iscritta a questo torneo.');
      }

      // 2. Inserisci giocatore (user_id sarà NULL)
      const playerData = {
        ...form,
        torneo_id: torneoId,
        status: 'iscritto'
      };

      const { error } = await supabase.from('tournament_players').insert([playerData]);

      if (error) throw error;

      setMessage({ type: 'success', text: '✅ Iscrizione effettuata con successo!' });
      setForm({ name: '', surname: '', email: '', phone: '' });
    } catch (err) {
      console.error('Iscrizione error:', err);
      setMessage({ type: 'error', text: err.message || 'Errore durante l\'iscrizione' });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full hover:shadow-md transition-all hover:-translate-y-0.5">
        {/* ✅ HEADER IDENTICO DASHBOARD */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-sm border border-gray-200">
            <UserPlus className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Iscrizione Giocatore</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Completa il form per iscriverti al torneo
          </p>
        </div>

        {/* ✅ MESSAGE */}
        {message.type && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 shadow-sm border ${
            message.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <span className="font-medium text-sm">{message.text}</span>
          </div>
        )}

        {/* ✅ FORM COMPATTO */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              Nome
            </label>
            <input 
              name="name" 
              placeholder="Mario" 
              value={form.name} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              Cognome
            </label>
            <input 
              name="surname" 
              placeholder="Rossi" 
              value={form.surname} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              Email
            </label>
            <input 
              name="email" 
              type="email" 
              placeholder="mario.rossi@email.com" 
              value={form.email} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              Telefono
            </label>
            <input 
              name="phone" 
              placeholder="+39 123 456 7890" 
              value={form.phone} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Elaborazione...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Iscriviti al Torneo
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          <p>Tutti i dati sono protetti secondo GDPR</p>
        </div>
      </div>
    </div>
  );
}
