// src/components/TournamentDetailPage.jsx - ✅ COMPLETO ID=3 FISSO
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Users, Loader2, User, Shield, Trophy, Menu, X, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

// --- HAMBURGER MINIMAL
function HamburgerMenu({ isOpen, isAdmin, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose}>
      <div className="bg-white w-72 h-full shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-gray-700" />
            <h2 className="font-bold text-xl">MENU</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          <Link to="/" onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 font-medium">
            <Home className="w-5 h-5 text-gray-700" />
            Dashboard
          </Link>
          
          <Link to="/tornei" onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 font-medium">
            <Trophy className="w-5 h-5 text-gray-700" />
            Tornei
          </Link>
          
          {isAdmin && (
            <Link to="/marketplace/gestione" onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 font-medium">
              <User className="w-5 h-5 text-gray-700" />
              Gestione
            </Link>
          )}
          
          <hr className="border-gray-200 my-3" />
          
          <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-red-50 font-medium text-red-600">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// --- HEADER COMPATTO BIANCO
function TournamentHeader({ tournamentName, matchesCount, isAdmin, onMenuToggle }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onMenuToggle} className="p-2 hover:bg-gray-100 rounded-xl">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{tournamentName}</h1>
          <p className="text-sm text-gray-600">Status: In corso</p>
        </div>
        
        {isAdmin && <Shield className="w-7 h-7 text-gray-700" />}
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <Users className="w-8 h-8 text-gray-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900">5</div>
          <div className="text-xs text-gray-500">Iscritti</div>
        </div>
        <div>
          <Trophy className="w-8 h-8 text-gray-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-900">{matchesCount}</div>
          <div className="text-xs text-gray-500">Matches</div>
        </div>
        <div>
          <User className="w-8 h-8 text-gray-500 mx-auto mb-1" />
          <div className="text-sm font-bold text-gray-900">05/12</div>
          <div className="text-xs text-gray-500">Inizio</div>
        </div>
      </div>
    </div>
  );
}

// --- ISCRITTI COMPATTI
function TournamentPlayers({ tournamentId }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournamentId) return;
    supabase
      .from('tournament_registrations')
      .select('id, user_id, users(id, email, name)')
      .eq('tournament_id', tournamentId)
      .then(({ data }) => {
        setPlayers(data || []);
        setLoading(false);
      });
  }, [tournamentId]);

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-sm border p-8 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin mr-3 text-gray-500" />
      <span className="font-medium">Caricamento...</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Iscritti ({players.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Giocatore</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Email</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const user = player.users || {};
              return (
                <tr key={player.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name || user.email || 'N/D'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- TABELLONE COMPLETO CON TORNEO FINALE
function TournamentBracket({ matches = [] }) {
  if (!matches.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-500">Tabellone vuoto</h3>
        <p className="text-sm text-gray-400 mt-1">Nessuna partita programmata</p>
      </div>
    );
  }

  // Ordina per round: Ottavi → Quarti → Semifinale → Finale
  const orderedMatches = [...matches].sort((a, b) => {
    const roundOrder = { 'Ottavi': 1, 'Quarti': 2, 'Semifinale': 3, 'Finale': 4, '3° Posto': 5 };
    return (roundOrder[a.round] || 99) - (roundOrder[b.round] || 99);
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 justify-center">
          <Trophy className="w-5 h-5" />
          Tabellone Completo ({matches.length} partite)
        </h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {orderedMatches.map((match) => (
          <div key={match.id} className="p-4 hover:bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center text-center">
              <div className="font-bold text-lg text-gray-900 p-2 bg-gray-50 rounded-lg">
                {match.player1 || 'Squadra A'}
              </div>
              
              <div className="md:col-span-2">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {match.score || '0-0'}
                </div>
                <div className="flex items-center gap-2 justify-center text-xs">
                  <span className={`px-2 py-1 rounded font-medium ${
                    match.round === 'Finale' ? 'bg-emerald-100 text-emerald-800' :
                    match.round === 'Semifinale' ? 'bg-blue-100 text-blue-800' :
                    match.round === 'Quarti' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {match.round || 'Quarti'}
                  </span>
                  <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded">
                    {match.court || 'Campo 1'}
                  </span>
                </div>
              </div>
              
              <div className="font-bold text-lg text-gray-900 p-2 bg-gray-50 rounded-lg">
                {match.player2 || 'Squadra B'}
              </div>
            </div>
            
            {match.winner && (
              <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                  match.round === 'Finale' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' :
                  'bg-green-100 text-green-800 border-green-200'
                } border`}>
                  🏆 Vincitore: {match.winner}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN COMPONENT COMPLETO - ID=3 FISSO
export default function TournamentDetailPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [tournamentName, setTournamentName] = useState('Padel Bari Masters 2025'); // ✅ NOME FISSO
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // ✅ TORNEI - ID=3 FISSO
    supabase.from('tournaments').select('name').eq('id', 3).single()
      .then(({ data }) => setTournamentName(data?.name || 'Padel Bari Masters 2025'));

    // ✅ MATCHES - UUID da ID=3 FISSO
    supabase.from('matches')
      .select('*')
      .eq('tournament_id', '00000003-0000-0000-0000-000000000003')
      .order('round')
      .then(({ data }) => {
        setMatches(data || []);
        setLoadingMatches(false);
      });
  }, []); // ✅ NO dependency

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <HamburgerMenu isOpen={menuOpen} isAdmin={isAdmin} onClose={() => setMenuOpen(false)} />

      <div className="max-w-4xl mx-auto space-y-6">
        <TournamentHeader 
          tournamentName={tournamentName} 
          matchesCount={matches.length} 
          isAdmin={isAdmin}
          onMenuToggle={() => setMenuOpen(true)}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <TournamentPlayers tournamentId={id || '3'} />
          
          {loadingMatches ? (
            <div className="bg-white rounded-2xl shadow-sm border p-8 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin mr-3 text-gray-500" />
              <span className="font-medium text-gray-700">Caricamento...</span>
            </div>
          ) : (
            <TournamentBracket matches={matches} />
          )}
        </div>
      </div>
    </div>
  );
}
