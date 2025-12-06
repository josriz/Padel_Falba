// src/components/TournamentBracket.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Users, Loader2, User as UserIcon } from 'lucide-react';

const demoMatches = [
  {
    id: 'M1',
    round: 'Ottavi',
    court: 1,
    player1: 'Rossi / Bianchi',
    player2: 'Verdi / Neri',
    score: '6-4 6-3',
    status: 'Giocata',
    winner: 'Rossi / Bianchi',
  },
  {
    id: 'M2',
    round: 'Ottavi',
    court: 2,
    player1: 'Blu / Gialli',
    player2: 'Grigi / Marroni',
    score: '7-5 6-4',
    status: 'Giocata',
    winner: 'Blu / Gialli',
  },
  {
    id: 'M3',
    round: 'Ottavi',
    court: 3,
    player1: 'Rosa / Viola',
    player2: 'Arancio / Celeste',
    score: '6-2 6-1',
    status: 'Giocata',
    winner: 'Rosa / Viola',
  },
  {
    id: 'M4',
    round: 'Ottavi',
    court: 4,
    player1: 'Azzurri / Neri',
    player2: 'Bianchi / Verdi',
    score: '3-6 6-4 10-7',
    status: 'Giocata',
    winner: 'Azzurri / Neri',
  },
  {
    id: 'Q1',
    round: 'Quarti',
    court: 1,
    player1: 'Rossi / Bianchi',
    player2: 'Blu / Gialli',
    score: '6-4 7-5',
    status: 'Giocata',
    winner: 'Rossi / Bianchi',
  },
  {
    id: 'Q2',
    round: 'Quarti',
    court: 2,
    player1: 'Rosa / Viola',
    player2: 'Azzurri / Neri',
    score: '6-3 6-4',
    status: 'Giocata',
    winner: 'Rosa / Viola',
  },
  {
    id: 'S1',
    round: 'Semifinale',
    court: 1,
    player1: 'Rossi / Bianchi',
    player2: 'Rosa / Viola',
    score: '6-4 6-4',
    status: 'Giocata',
    winner: 'Rossi / Bianchi',
  },
  {
    id: 'F1',
    round: 'Finale',
    court: 'Centrale',
    player1: 'Rossi / Bianchi',
    player2: 'Lupi / Tigri',
    score: '6-4 3-6 10-8',
    status: 'Giocata',
    winner: 'Rossi / Bianchi',
  },
];

export default function TournamentBracket({ tournamentId, matches }) {
  // 🔧 AGGIUNTO: 3 tabs stile Coppa Italia
  const [activeTab, setActiveTab] = useState('partite');
  const [tournamentData, setTournamentData] = useState({
    matches: matches || demoMatches,
    players: [],
    teamStats: []
  });
  const [loading, setLoading] = useState(false);

  // 🔧 AGGIUNTO: Carica dati da Supabase
  useEffect(() => {
    if (!tournamentId) return;

    const loadTournamentData = async () => {
      setLoading(true);
      try {
        // Carica slot tabellone da tournament_bracket
        const { data: bracketSlots } = await supabase
          .from('tournament_bracket')
          .select(`
            slot_index,
            public_users (
              id, name, surname
            )
          `)
          .eq('tournament_id', tournamentId)
          .order('slot_index');

        // Carica iscritti
        const { data: playersData } = await supabase
          .from('tournament_registrations')
          .select(`
            id,
            public_users (
              id, name, surname, email
            )
          `)
          .eq('tournament_id', tournamentId);

        setTournamentData({
          matches: demoMatches, // TODO: genera da bracketSlots
          players: playersData || [],
          teamStats: generateTeamStats(playersData || [])
        });
      } catch (error) {
        console.error('Errore caricamento dati:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTournamentData();
  }, [tournamentId]);

  const generateTeamStats = (players) => {
    return [
      { name: 'Rossi-Bianchi', wins: 4, sets: 8, points: 52 },
      { name: 'Verdi-Neri', wins: 1, sets: 3, points: 28 },
      { name: 'Blu-Gialli', wins: 2, sets: 5, points: 41 }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-8 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        Caricamento tabellone...
      </div>
    );
  }

  const data = tournamentData.matches;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 🔧 AGGIUNTO: Menu 3 tabs stile Coppa Italia */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-1 shadow-xl">
        <div className="flex bg-white/20 backdrop-blur-sm rounded-2xl overflow-hidden">
          <button
            className={`flex-1 py-4 px-6 font-bold text-lg transition-all ${
              activeTab === 'partite'
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/20'
            }`}
            onClick={() => setActiveTab('partite')}
          >
            🏆 Partite
          </button>
          <button
            className={`flex-1 py-4 px-6 font-bold text-lg transition-all ${
              activeTab === 'statistiche'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/20'
            }`}
            onClick={() => setActiveTab('statistiche')}
          >
            📊 Statistiche
          </button>
          <button
            className={`flex-1 py-4 px-6 font-bold text-lg transition-all ${
              activeTab === 'giocatori'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/20'
            }`}
            onClick={() => setActiveTab('giocatori')}
          >
            👥 Giocatori
          </button>
        </div>
      </div>

      {/* 🔧 TAB 1: PARTITE (tuo codice originale migliorato) */}
      {activeTab === 'partite' && (
        <>
          <h3 className="text-2xl font-black text-center mb-8 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            🏆 TABELLONE TORNEO
          </h3>
          <div className="space-y-4">
            {data.map(match => (
              <div
                key={match.id}
                className="grid grid-cols-3 gap-4 items-center bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <div className="flex flex-col items-center gap-1 p-4 bg-gradient-to-b from-emerald-50 to-green-50 rounded-2xl">
                  <span className="font-black text-lg text-emerald-800">
                    {match.player1 || 'Squadra A'}
                  </span>
                  <span className="text-xs text-gray-600">
                    {match.round ? `${match.round}` : ''}
                  </span>
                </div>

                <div className="text-center p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Campo {match.court}
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-2">
                    {match.score || 'da giocare'}
                  </div>
                  {match.winner && (
                    <div className="text-green-600 font-bold text-sm">
                      ✅ {match.winner}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-1 p-4 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl">
                  <span className="font-black text-lg text-blue-800">
                    {match.player2 || 'Squadra B'}
                  </span>
                  <span className="text-xs text-gray-600">ID: {match.id}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🔧 TAB 2: STATISTICHE COPPIE */}
      {activeTab === 'statistiche' && (
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-center mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            📊 Statistiche Coppie
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournamentData.teamStats.map((team, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-lg border border-purple-100 hover:shadow-xl">
                <div className="text-2xl font-black text-purple-800 mb-4">{team.name}</div>
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span>Vittorie</span>
                    <span className="font-bold text-emerald-600">{team.wins}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Set vinti</span>
                    <span className="font-bold text-blue-600">{team.sets}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Punti totali</span>
                    <span className="font-bold text-indigo-600">{team.points}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔧 TAB 3: GIOCATORI */}
      {activeTab === 'giocatori' && (
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-center mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            👥 Tutti i Giocatori
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {tournamentData.players.map((p) => {
              const user = p.public_users || {};
              const name = `${user.name || ''} ${user.surname || ''}`.trim() || user.email || 'N/D';
              return (
                <div key={p.id} className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl border border-orange-100">
                  <div className="text-xl font-bold text-gray-900 mb-2 truncate">{name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
