import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { 
  Trophy, Users, Edit3, CheckCircle, X, Loader2, Save 
} from 'lucide-react';

export default function TournamentBracketAdmin({ tournamentId }) {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    fetchData();
  }, [tournamentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Carica partite e giocatori
      const [{ data: matchesData }, { data: playersData }] = await Promise.all([
        supabase.from('matches').select('*').eq('tournament_id', tournamentId),
        supabase.from('tournament_players').select(`
          id, user_id, users(name, fullName)
        `).eq('tournament_id', tournamentId)
      ]);
      
      setMatches(matchesData || []);
      setPlayers(playersData || []);
    } catch (err) {
      console.error('Errore caricamento:', err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const draggedMatch = matches[source.index];
    
    // Aggiorna posizione partita nel DB
    const { error } = await supabase
      .from('matches')
      .update({ round_number: destination.droppableId, position: destination.index })
      .eq('id', draggedMatch.id);

    if (!error) {
      // Reorder locale
      const newMatches = Array.from(matches);
      newMatches.splice(source.index, 1);
      newMatches.splice(destination.index, 0, draggedMatch);
      setMatches(newMatches);
    }
  };

  const updateScore = async (matchId, scoreA, scoreB) => {
    const { error } = await supabase
      .from('matches')
      .update({ score_player_a: scoreA, score_player_b: scoreB })
      .eq('id', matchId);

    if (!error) {
      setMatches(matches.map(m => 
        m.id === matchId ? { ...m, score_player_a: scoreA, score_player_b: scoreB } : m
      ));
    }
  };

  const eliminatePlayer = async (matchId, winnerSide) => {
    // Logica eliminazione giocatore perdente
    await supabase.from('matches').update({ 
      winner: winnerSide === 'a' ? 'player_a' : 'player_b',
      status: 'completed'
    }).eq('id', matchId);
    
    fetchData(); // Refresh
  };

  if (loading) return <Loader2 className="animate-spin w-8 h-8 mx-auto" />;

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-600" />
          Tabellone Interattivo - {tournamentId}
        </h2>
        <button 
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Aggiorna
        </button>
      </div>

      {/* DRAG & DROP CONTEXT */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[70vh] overflow-y-auto">
          {[1, 2, 3].map((round) => (
            <Droppable droppableId={round.toString()} key={round}>
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    snapshot.isDraggingOver 
                      ? 'bg-blue-50 border-blue-300 shadow-xl scale-105' 
                      : 'bg-gradient-to-b from-gray-50 to-white border-gray-200 shadow-lg'
                  }`}
                >
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    Round {round} 
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {matches.filter(m => m.round_number === round).length} Partite
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {matches
                      .filter(m => m.round_number === round)
                      .map((match, index) => (
                        <Draggable key={match.id} draggableId={match.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 rounded-xl border transition-all cursor-move group ${
                                snapshot.isDragging 
                                  ? 'shadow-2xl scale-105 bg-white border-blue-400' 
                                  : 'hover:shadow-lg border-gray-200 bg-white'
                              }`}
                            >
                              {/* Giocatori */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                      <Users className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-sm">
                                      {match.player_a_name || 'Giocatore A'}
                                    </span>
                                  </div>
                                  {match.player_b_name && (
                                    <span className="text-xs text-gray-500 block">
                                      + {match.player_b_name}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                      <Users className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-sm">
                                      {match.player_b_name || 'Giocatore B'}
                                    </span>
                                  </div>
                                  {match.player_b2_name && (
                                    <span className="text-xs text-gray-500 block">
                                      + {match.player_b2_name}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* PUNTEGGI INPUT */}
                              <div className="flex items-center gap-4 mb-3">
                                <input
                                  type="number"
                                  value={match.score_player_a || ''}
                                  onChange={(e) => updateScore(match.id, e.target.value, match.score_player_b)}
                                  className="w-16 p-2 border rounded-lg text-center font-bold text-lg"
                                  placeholder="0"
                                />
                                <span className="text-xl font-bold text-gray-400">VS</span>
                                <input
                                  type="number"
                                  value={match.score_player_b || ''}
                                  onChange={(e) => updateScore(match.id, match.score_player_a, e.target.value)}
                                  className="w-16 p-2 border rounded-lg text-center font-bold text-lg"
                                  placeholder="0"
                                />
                              </div>

                              {/* AZIONI ADMIN */}
                              <div className="flex items-center gap-2">
                                {match.winner === 'player_a' && (
                                  <CheckCircle className="w-5 h-5 text-green-600" title="Vincitore A" />
                                )}
                                {match.winner === 'player_b' && (
                                  <CheckCircle className="w-5 h-5 text-green-600" title="Vincitore B" />
                                )}
                                <button
                                  onClick={() => eliminatePlayer(match.id, 'a')}
                                  className="p-1 hover:bg-red-100 rounded-lg"
                                  title="Elimina Giocatore A"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </button>
                                <button
                                  onClick={() => eliminatePlayer(match.id, 'b')}
                                  className="p-1 hover:bg-red-100 rounded-lg ml-auto"
                                  title="Elimina Giocatore B"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </button>
                              </div>

                              {match.status && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    match.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    match.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {match.status === 'completed' ? '✓ Completata' :
                                     match.status === 'scheduled' ? '⏳ Programmata' : '⚡ In corso'}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Lista Giocatori Disponibili */}
      <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Giocatori Disponibili ({players.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {players.map((player) => (
            <div key={player.id} className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="font-medium text-sm text-gray-900">
                {player.users?.fullName || player.users?.name || 'Giocatore'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
