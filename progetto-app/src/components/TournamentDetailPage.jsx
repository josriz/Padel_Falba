import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const TournamentDetailPage = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [participantsCount, setParticipantsCount] = useState(0); // ✅ Conteggio totale
  const [showPlayersMenu, setShowPlayersMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // ✅ Torneo OK
        const { data: tournamentData } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', id)
          .single();
        setTournament(tournamentData);

        // ✅ MULTI-TABELLA: Prova tutte le tabelle possibili
        const tables = ['tournament_registrations', 'tournament_participants', 'tournament_players', 'registrations'];
        let allPlayers = [];
        let totalCount = 0;
        
        for (const table of tables) {
          try {
            const { data, count, error: tableError } = await supabase
              .from(table)
              .select('id, nome, cognome, email, user_id, name, surname, player_name, player_surname, player_email, team_name')
              .eq('tournament_id', id);
            
            if (tableError) {
              console.log(`❌ ${table}:`, tableError.message);
            } else {
              console.log(`✅ ${table}: ${data?.length || 0} giocatori`);
              allPlayers = [...allPlayers, ...(data || [])];
              totalCount += count || data?.length || 0;
            }
          } catch (e) {
            console.log(`❌ Tabella ${table} non esiste`);
          }
        }
        
        // ✅ Deduplica per ID
        const uniquePlayers = allPlayers.filter((player, index, self) => 
          index === self.findIndex(p => p.id === player.id)
        );
        
        setPlayers(uniquePlayers);
        setParticipantsCount(totalCount);
        console.log('✅ TournamentDetailPage: TOTALE', totalCount, 'giocatori caricati');
        
      } catch (err) {
        console.error('❌ fetchData:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>;

  if (!tournament) return <div className="min-h-screen flex items-center justify-center">Torneo non trovato</div>;

  const getPlayerName = (player) => {
    const nome = player.nome || player.name || player.player_name || 'N/D';
    const cognome = player.cognome || player.surname || player.player_surname || '';
    return `${nome} ${cognome}`.trim();
  };

  const getPlayerEmail = (player) => {
    return player.email || player.player_email || 'N/D';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center mb-6">
        <div>
          <Link to="/admin" className="text-blue-500 hover:underline mb-2 inline-block">&larr; Torna indietro</Link>
          <h1 className="text-3xl font-bold">{tournament.name}</h1>
          <p className="text-lg text-gray-600 mt-1">
            👥 <strong>{participantsCount}</strong> iscritti / {tournament.max_players || 16} max
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowPlayersMenu(!showPlayersMenu)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            👥 {participantsCount} Iscritti
          </button>
        </div>
      </header>

      <div className="flex gap-6">
        {/* MENU ISCRITTI */}
        {showPlayersMenu && (
          <div className="bg-white p-6 rounded-xl shadow-md w-80 sticky top-8 h-fit border border-blue-100">
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2 text-blue-800">
              <Users className="w-6 h-6" />
              Iscritti ({players.length})
            </h2>
            {players.length === 0 ? (
              <div className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                Nessun iscritto trovato
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {players.map((p, i) => (
                  <div key={p.id || i} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:shadow-md transition-all">
                    <div className="font-semibold text-gray-900 mb-1">
                      {getPlayerName(p)}
                    </div>
                    <div className="text-sm text-gray-600 truncate">{getPlayerEmail(p)}</div>
                    {p.team_name && (
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 font-medium">
                        👥 {p.team_name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TABELLONE */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
            🏆 Tabellone {tournament.name}
          </h2>
          
          {/* SLOTS TABELLONE */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-8">
            {Array.from({ length: tournament.max_players || 16 }, (_, i) => (
              <div key={i} className="group p-6 border-2 border-dashed border-gray-300 rounded-2xl text-center min-h-24 flex flex-col items-center justify-center hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-all">
                  <span className="text-lg font-bold text-gray-600">P{i + 1}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">Slot {i + 1}</span>
              </div>
            ))}
          </div>
          
          {/* PROSSIMI PASSI */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-800">
              🚀 Prossimi passi:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to={`/tournaments/${id}/players`} 
                className="p-4 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 font-semibold text-blue-800"
              >
                👥 Gestione Iscritti ({participantsCount})
              </Link>
              <Link 
                to={`/tournaments/${id}/bracket`} 
                className="p-4 bg-white rounded-xl border-2 border-green-200 hover:border-green-300 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 font-semibold text-green-800"
              >
                🏆 Bracket Semplice
              </Link>
              <Link 
                to={`/tournaments/${id}/board`} 
                className="p-4 bg-white rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 font-semibold text-purple-800"
              >
                🎾 Tabellone Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailPage;
