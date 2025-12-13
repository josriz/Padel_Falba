// src/components/TournamentRegisterAuth.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";
import {
  Users,
  Loader2,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function TournamentRegisterAuth() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTorneo, setSelectedTorneo] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const { data, error } = await supabase
      .from("tournaments")
      .select(
        `
        *,
        tournament_registrations:user_id (user_id)
      `
      );

    if (error) {
      console.error(error);
    } else {
      const tournamentsWithCount = (data || []).map((t) => ({
        ...t,
        totalIscritti: t.tournament_registrations?.length || 0,
      }));
      setTournaments(tournamentsWithCount);
    }
    setLoading(false);
  };

  const handleIscrizione = async () => {
    if (!selectedTorneo || !user) {
      setMessage({
        type: "error",
        text: "❌ Devi fare login e selezionare un torneo!",
      });
      return;
    }

    setRegisterLoading(true);
    try {
      const { error } = await supabase.from("tournament_registrations").insert({
        tournament_id: selectedTorneo,
        user_id: user.id,
      });

      if (error) {
        setMessage({ type: "error", text: `❌ Errore: ${error.message}` });
      } else {
        setMessage({
          type: "success",
          text: "✅ Iscrizione avvenuta con successo!",
        });
        setSelectedTorneo("");
        fetchTournaments();
      }
    } catch (err) {
      setMessage({ type: "error", text: `❌ Errore: ${err.message}` });
    } finally {
      setRegisterLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-600" />
          <p className="text-xl text-gray-600 font-semibold">
            Caricamento tornei...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-md mx-auto hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Iscrizione Tornei
            </h2>
            <p className="text-sm text-gray-600">
              Seleziona il torneo e iscriviti
            </p>
          </div>

          {!user ? (
            <div className="text-center py-8 space-y-4">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Login richiesto
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Effettua il login per iscriverti ai tornei
              </p>
              <a
                href="/auth"
                className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
              >
                Vai al Login →
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-emerald-700 font-medium">
                      Pronto per iscriverti
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Seleziona Torneo
                </label>
                <select
                  value={selectedTorneo}
                  onChange={(e) => setSelectedTorneo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-semibold"
                  disabled={registerLoading}
                >
                  <option value="">📋 Seleziona un torneo</option>
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id} className="text-sm">
                      {t.name} ({t.totalIscritti}/{t.max_players || 16} max) - €
                      {t.price || 0}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleIscrizione}
                disabled={!selectedTorneo || registerLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
              >
                {registerLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Iscrizione in corso...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    Iscriviti Ora
                  </>
                )}
              </button>

              {message && (
                <div
                  className={`p-4 rounded-xl mt-4 flex items-start gap-3 shadow-sm ${
                    message.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  Tornei disponibili: <strong>{tournaments.length}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------

// src/components/TournamentViewOnly.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  Users,
  Plus,
  CheckCircle,
  Loader2,
  Calendar,
} from "lucide-react";

export function TournamentViewOnly() {
  const [tournaments, setTournaments] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data: tournamentsData, error: tournamentsError } = await supabase
        .from("tournaments")
        .select(
          `
          *,
          tournament_registrations:user_id (user_id)
        `
        )
        .order("created_at", { ascending: false });

      if (tournamentsError) throw tournamentsError;

      const tournamentsWithCount = (tournamentsData || []).map((t) => ({
        ...t,
        totalIscritti: t.tournament_registrations?.length || 0,
      }));
      setTournaments(tournamentsWithCount);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && user.id) {
        const { data: myRegs } = await supabase
          .from("tournament_registrations")
          .select("tournament_id")
          .eq("user_id", user.id);
        const regsMap = {};
        myRegs?.forEach((reg) => {
          regsMap[reg.tournament_id] = true;
        });
        setMyRegistrations(regsMap);
      }
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (tournamentId) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: "error", text: "❌ Effettua il login!" });
        return;
      }

      const { error } = await supabase.from("tournament_registrations").insert({
        tournament_id: tournamentId,
        user_id: user.id,
      });

      if (error) throw error;
      setMessage({ type: "success", text: "✅ Iscritto con successo!" });
      fetchData();
    } catch (error) {
      setMessage({ type: "error", text: `❌ Errore: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
      </div>
    );
  if (fetchError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {fetchError}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <Calendar className="w-9 h-9 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tornei Disponibili
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            ({tournaments.length}) Iscriviti ai tornei padel
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl mb-4 flex items-start gap-3 shadow-sm ${
              message.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 mt-0.5" />
            ) : (
              <Users className="w-5 h-5 mt-0.5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3 group"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {t.name}
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {t.totalIscritti}/{t.max_players || 16} posti | €
                    {t.price || 0}
                  </span>
                </div>
                <span
                  className={`block w-full px-4 py-2 rounded-xl text-sm font-bold text-center text-white ${
                    t.status === "pianificato"
                      ? "bg-blue-600"
                      : t.status === "in_corso"
                      ? "bg-yellow-600"
                      : "bg-green-600"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <button
                disabled={myRegistrations[t.id]}
                onClick={() => handleRegister(t.id)}
                className={`w-full py-3 px-6 font-bold rounded-xl text-white flex items-center justify-center gap-2 text-sm transition-all hover:-translate-y-0.5 ${
                  myRegistrations[t.id]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-md"
                }`}
              >
                <Plus className="w-4 h-4" />
                {myRegistrations[t.id] ? "Già iscritto" : "Iscriviti"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
