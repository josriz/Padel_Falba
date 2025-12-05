// src/components/ProfilePage.jsx - COMPLETO con import supabase
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import supabase aggiunto
import { useAuth } from '../context/AuthProvider';
import { User, Mail, Shield, Edit3, MapPin, Check } from 'lucide-react';
import PageContainer from './PageContainer';

export default function ProfilePage(props) {
  const { user, isAdmin } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data || {});
      setEditData(data || {});
    } catch (err) {
      console.error('Errore profilo:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...editData });
      if (!error) {
        setProfile(editData);
        setEditing(false);
        alert('Profilo aggiornato!');
      }
    } catch (err) {
      console.error('Errore save:', err);
    }
  };

  if (!user) {
    return (
      <PageContainer title="ProfilePage">
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center p-12">
            <User className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Devi fare login</h2>
            <p className="text-xl text-gray-600">Accedi per gestire il tuo profilo PadelClub</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (loading) return (
    <PageContainer title="ProfilePage">
      <div className="text-center py-20">Caricamento profilo...</div>
    </PageContainer>
  );

  return (
    <PageContainer title="ProfilePage">
      <div className="max-w-4xl mx-auto p-8 pt-20">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">{profile.full_name || user.email.split('@')[0]}</h1>
              <p className="text-xl text-gray-600 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {user.email}
              </p>
              {isAdmin && (
                <p className="text-lg text-emerald-600 flex items-center gap-2 mt-1">
                  <Shield className="w-5 h-5" />
                  AMMINISTRATORE
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-3xl hover:shadow-xl transition-all"
          >
            <Edit3 className="w-5 h-5" />
            {editing ? 'Annulla' : 'Modifica Profilo'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-4xl shadow-2xl border">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="w-7 h-7 text-orange-500" />
              Informazioni Personali
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
                {editing ? (
                  <input
                    value={editData.full_name || ''}
                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg"
                  />
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">{profile.full_name || 'Non impostato'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefono</label>
                {editing ? (
                  <input
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-500/20"
                  />
                ) : (
                  <p className="text-xl text-gray-700">{profile.phone || 'Non impostato'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Livello Padel</label>
                {editing ? (
                  <select
                    value={editData.padel_level || ''}
                    onChange={(e) => setEditData({ ...editData, padel_level: e.target.value })}
                    className="w-full p-4 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-emerald-500/20"
                  >
                    <option value="">Seleziona...</option>
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzato">Avanzato</option>
                    <option value="pro">Professionista</option>
                  </select>
                ) : (
                  <p className="text-xl text-gray-700 capitalize">{profile.padel_level || 'Non impostato'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/80 p-8 rounded-4xl shadow-2xl border border-emerald-100">
            <h3 className="text-2xl font-bold mb-6 text-emerald-800">Statistiche PadelClub</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-black text-emerald-600 mb-1">5</div>
                <div className="text-sm text-emerald-800 font-semibold">Tornei</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-600 mb-1">12</div>
                <div className="text-sm text-emerald-800 font-semibold">Prenotazioni</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-600 mb-1">2</div>
                <div className="text-sm text-emerald-800 font-semibold">Articoli Venduti</div>
              </div>
            </div>
          </div>
        </div>

        {editing && (
          <div className="mt-12 p-8 bg-blue-50 rounded-4xl border-2 border-blue-100">
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setEditing(false)}
                className="px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-3xl hover:bg-gray-300 transition-all"
              >
                Annulla
              </button>
              <button
                onClick={saveProfile}
                className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Salva Profilo
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
