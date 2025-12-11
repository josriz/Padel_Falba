// src/pages/TabellonePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TournamentBracket from '../components/TournamentBracket';
import { supabase } from '../supabaseClient';

export default function TabellonePage() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [bracketSlots, setBracketSlots] = useState([]);
  const [tournamentName, setTournamentName] = useState('Demo');

  useEffect(() => {
    if (tournamentId) {
      supabase
        .from('tournaments')
        .select('name')
        .eq('id', tournamentId)
        .single()
        .then(({ data, error }) => {
          if (data) {
            setTournamentName(data.name);
            document.title = `Tabellone - ${data.name}`;
          }
        });
    }
  }, [tournamentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            ← Indietro
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
              🏆 Tabellone Torneo
            </h1>
            <p className="text-xl text-gray-600 font-semibold">#{tournamentId} - {tournamentName}</p>
          </div>
        </div>
      </div>

      {/* Tabellone */}
      <div className="max-w-7xl mx-auto px-4">
        <TournamentBracket 
          tournamentId={tournamentId}
          bracketSlots={bracketSlots}
          setBracketSlots={setBracketSlots}
        />
      </div>
    </div>
  );
}
