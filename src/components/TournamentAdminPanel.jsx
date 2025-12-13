// src/components/TournamentAdminPanel.jsx - ✅ CREAZIONE SOLA (NO ISCRITTI!)
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import PageContainer from './PageContainer';
import { useNavigate } from 'react-router-dom';

export default function TournamentAdminPanel() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    max_players: 16,
    date: '',
    status: 'pianificato'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isAdmin) return null;

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('tournaments').insert([formData]);
      if (error) throw error;

      setMessage({ type: 'success', text: '✅ Torneo creato con successo!' });
      setFormData({
        name: '',
        price: 0,
        max_players: 16,
        date: '',
        status: 'pianificato'
      });
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Errore: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Gestione Tornei">
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
        {/* Top bar con bottone Indietro IDENTICO a TournamentBracket */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-50"
          >
            ← Indietro
          </button>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Crea nuovo torneo
            </h1>
            <p className="text-sm text-gray-500">
              Compila i campi per aggiungere un torneo al sistema.
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium shadow-sm ${
                message.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleCreateTournament} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome torneo
                </label>
                <input
                  type="text"
                  placeholder="Es: CieffePadelADMIN 2025"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prezzo (€)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number(e.target.value)
                    })
                  }
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max giocatori
                </label>
                <select
                  value={formData.max_players}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_players: Number(e.target.value)
                    })
                  }
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value={8}>8 giocatori</option>
                  <option value={16}>16 giocatori</option>
                  <option value={24}>24 giocatori</option>
                  <option value={32}>32 giocatori</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={loading || !formData.name}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Crea torneo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
