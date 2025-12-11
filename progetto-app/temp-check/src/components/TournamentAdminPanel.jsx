// src/components/TournamentAdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";
import { Plus, Trash2, Loader2, RefreshCw, Users, Mail } from "lucide-react";
import TournamentBracket from "./TournamentBracket";

export default function TournamentAdminPanel() {
  const { isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    status: "pianificato",
    max_players: 32,
    price: 0,
    start_date: ""
  });

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setTournaments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchTournaments();
  }, [isAdmin]);

  const fetchParticipants = async (torneoId) => {
    const { data } = await supabase
      .from("tournament_participants")
      .select("id, nome, cognome, email")
      .eq("torneo_id", torneoId);
    setParticipants(data || []);
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = [{
        name: formData.name,
        status: formData.status,
        max_players: formData.max_players,
        price: formData.price,
        start_date: formData.start_date
      }];
      const { error } = await supabase.from("tournaments").insert(payload);
      if (error) throw error;
      alert("✅ Torneo creato!");
      setShowForm(false);
      setFormData({ name: "", status: "pianificato", max_players: 32, price: 0, start_date: "" });
      fetchTournaments();
    } catch (err) {
      alert("❌ Errore: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTournament = async (id) => {
    if (!confirm("Eliminare il torneo?")) return;
    try {
      const { error } = await supabase.from("tournaments").delete().eq("id", id);
      if (error) throw error;
      fetchTournaments();
    } catch (err) {
      alert("❌ Errore eliminazione: " + err.message);
    }
  };

  if (!isAdmin) return <div>🚫 Accesso negato - Solo Admin</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">🏆 Gestione Tornei Admin</h1>
        <div className="flex gap-4">
          <button onClick={fetchTournaments} className="flex items-center gap-2 px-4 py-2 border rounded">
            <RefreshCw className="w-5 h-5" /> Aggiorna
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold">
            <Plus className="w-5 h-5" /> {showForm ? "Annulla" : "Nuovo Torneo"}
          </button>
        </div>
      </header>

      {showForm && (
        <form onSubmit={handleCreateTournament} className="bg-white p-8 rounded-xl shadow-xl mb-8 grid gap-4 max-w-xl">
          <input
            placeholder="Nome Torneo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-4 border rounded-xl"
            required
          />
          <input
            type="number"
            placeholder="Prezzo Iscrizione"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="p-4 border rounded-xl"
            required
          />
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="p-4 border rounded-xl"
            required
          />
          <select
            value={formData.max_players}
            onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) })}
            className="p-4 border rounded-xl"
          >
            <option value={8}>8 giocatori</option>
            <option value={16}>16 giocatori</option>
            <option value={32}>32 giocatori</option>
            <option value={64}>64 giocatori</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="p-4 border rounded-xl"
          >
            <option value="pianificato">📅 Pianificato</option>
            <option value="in_corso">⚡ In Corso</option>
            <option value="completato">✅ Completato</option>
          </select>
          <button className="p-4 bg-blue-600 text-white rounded-xl font-bold">{loading ? "⏳ Creazione..." : "✅ Crea Torneo"}</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col">
            <h3 className="text-xl font-bold mb-2">{t.name}</h3>
            <p>👥 Giocatori: {t.max_players}</p>
            <p>💰 Prezzo: {t.price}€</p>
            <p>📅 Inizio: {t.start_date}</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${t.status === "pianificato" ? "bg-blue-100 text-blue-800" : t.status === "in_corso" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
              {t.status === "pianificato" ? "📅 Pianificato" : t.status === "in_corso" ? "⚡ In Corso" : "✅ Completato"}
            </span>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setSelectedTournamentId(t.id); fetchParticipants(t.id); }}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <Users className="w-4 h-4" /> Iscritti
              </button>
              <button onClick={() => handleDeleteTournament(t.id)} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                <Trash2 className="w-4 h-4" /> Elimina
              </button>
            </div>
            {selectedTournamentId === t.id && participants.length > 0 && (
              <div className="mt-4 bg-gray-50 p-4 rounded-xl shadow-inner max-h-64 overflow-y-auto">
                <h4 className="font-bold mb-2">Iscritti</h4>
                {participants.map((p) => (
                  <div key={p.id} className="flex justify-between border-b py-1 text-sm">
                    <span>{p.nome} {p.cognome}</span>
                    <span>{p.email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTournamentId && (
        <div className="mt-12">
          <TournamentBracket tournamentId={selectedTournamentId} />
        </div>
      )}
    </div>
  );
}
