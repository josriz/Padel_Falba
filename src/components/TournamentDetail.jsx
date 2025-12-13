// src/components/TournamentDetails.jsx - COMPLETO E DEFINITIVO
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Loader2, Users, Calendar, MapPin, DollarSign, CheckCircle } from "lucide-react";

export default function TournamentDetails({ tournament, onBack }) {
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("4.0");
  const [loading, setLoading] = useState(false);
  const [registrationsCount, setRegistrationsCount] = useState(0);

  useEffect(() => {
    checkUser();
    fetchRegistrationsCount();
  }, [tournament.id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) checkRegistration(user.id);
  };

  const checkRegistration = async (userId) => {
    const { count } = await supabase
      .from("tournament_registrations")
      .select("*", { count: "exact", head: true })
      .eq("tournament_id", tournament.id)
      .eq("user_id", userId);
    setIsRegistered(count > 0);
  };

  const fetchRegistrationsCount = async () => {
    const { count } = await supabase
      .from("tournament_registrations")
      .select("*", { count: "exact", head: true })
      .eq("tournament_id", tournament.id);
    setRegistrationsCount(count || 0);
  };

  // ✅ FIX DEFINITIVO: NOME REALE ALL'ISCRIZIONE
  const handleRegister = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // RECUPERA PROFILO REALE
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, first_name, last_name')
        .eq('id', user.id)
        .single();

      const fullName = profile?.full_name?.trim() ||
                      (profile?.first_name && profile?.last_name
                        ? `${profile.first_name.trim()} ${profile.last_name.trim()}`
                        : user.email.split('@')[0]);

      const { error } = await supabase.from('tournament_registrations').insert({
        tournament_id: tournament.id,
        user_id: user.id,
        full_name: fullName,        // ✅ NOME REALE!
        display_name: fullName,     // ✅ NOME REALE!
        level: selectedLevel
      });

      if (!error) {
        setIsRegistered(true);
        setRegistrationsCount(prev => prev + 1);
        alert(`✅ Iscritto con successo come "${fullName}"!`);
      }
    } catch (err) {
      alert('❌ Errore iscrizione: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('tournament_registrations')
        .delete()
        .eq('tournament_id', tournament.id)
        .eq('user_id', user.id);
      
      if (!error) {
        setIsRegistered(false);
        setRegistrationsCount(prev => Math.max(0, prev - 1));
        alert('✅ Cancellata iscrizione!');
      }
    } catch (err) {
      alert('❌ Errore: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold"
          >
            Indietro
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-gray-900">{tournament.name}</h1>
            <p className="text-emerald-600 font-bold text-2xl mt-2">
              {registrationsCount}/{tournament.max_players || 16} iscritti
            </p>
          </div>
        </div>

        {/* Dettagli Torneo */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 p-6 bg-emerald-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-emerald-600" />
              <span>{new Date(tournament.data_inizio).toLocaleDateString('it-IT')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-emerald-600" />
              <span>{tournament.max_players || 16} giocatori</span>
            </div>
            {tournament.price > 0 && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                <span>€{tournament.price} a coppia</span>
              </div>
            )}
          </div>

          {/* Livello e Iscrizione */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Il tuo livello:</label>
            <select 
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              disabled={isRegistered}
            >
              <option value="3.5">3.5</option>
              <option value="4.0">4.0</option>
              <option value="4.5">4.5</option>
              <option value="5.0">5.0</option>
            </select>

            {user ? (
              isRegistered ? (
                <button
                  onClick={handleUnregister}
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                  Già iscritto - Cancella
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Users className="w-6 h-6" />}
                  ISCRIVITI ORA
                </button>
              )
            ) : (
              <p className="text-center text-gray-500 py-4">Accedi per iscriverti</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200 flex gap-4">
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold">
            Tabellone
          </button>
          <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-bold">
            Regole
          </button>
        </div>
      </div>
    </div>
  );
}
