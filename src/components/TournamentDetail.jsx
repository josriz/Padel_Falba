import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // ← ADATTA PATH

const TournamentDetailPage = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [showPlayersMenu, setShowPlayersMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ CARICA DATI REALI SUPABASE
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Torneo
      const { data: tournamentData } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single();
      setTournament(tournamentData);

      // Iscritti REALI
      const { data: registrations } = await supabase
        .from('tournament_registrations')
        .select(`
          *,
          profiles (
            full_name,
            email,
            is_admin
          )
        `)
        .eq('tournament_id', id);
      
      setPlayers(registrations || []);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 overflow-hidden">
      
      {/* HEADER STICKY */}
      <header className="bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-2xl flex items-center justify-center">
                <span className="text-3xl">🏆</span>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-emerald-900 bg-clip-text text-transparent">
                  {tournament?.name || 'Caricamento...'}
                </h1>
                <div className="flex items-center space-x-6 text-sm text-gray-600 mt-1">
                  <span>📅 {tournament?.date || 'N/D'}</span>
                  <span>👥 {players.length} iscritti</span>
                  <span>⚡ Round of 16</span>
                </div>
              </div>
            </div>
            
            {/* AZIONI */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowPlayersMenu(!showPlayersMenu)}
                className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-500/90 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span>👥 {players.length} Iscritti</span>
                <span className={`transform transition-transform ${showPlayersMenu ? 'rotate-180' : ''}`}>
                  ►
                </span>
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                🎲 Sorteggio
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                💾 Salva
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-140px)] overflow-hidden">
        
        {/* MENU LATERALE ISCRITTI */}
        <div className={`bg-white/80 backdrop-blur-xl shadow-2xl border-r border-emerald-200/50 transition-all duration-300 w-80 z-40 absolute lg:relative lg:translate-x-0 ${
          showPlayersMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-500 rounded mr-3"></span>
              Iscritti ({players.length})
            </h2>
            
            <div className="space-y-3">
              {players.map((registration, i) => {
                const player = registration.profiles;
                return (
                  <div key={registration.id} className="group bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-2xl border border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <span className="font-bold text-white text-sm">P{i+1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-lg text-gray-900 truncate">{player?.full_name || 'N/D'}</p>
                          <p className="text-sm text-emerald-700 font-semibold">{registration.level || 'N/D'}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                        Disponibile
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* TABELLONE FULLSCREEN */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            
            {/* BRACKET OTTAGONALE */}
            <div className="relative isolate">
              
              {/* SFONDO BRACKET */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/30 to-blue-100/30 rounded-3xl blur-xl -z-10"></div>
              
              {/* LINEA CENTRALE */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-1/4 h-1/2 w-1 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full shadow-lg"></div>
              
              {/* SLOT GIOCATORI */}
              <div className="grid grid-cols-8 gap-6 py-20 relative z-10">
                {Array.from({length: 16}, (_, i) => (
                  <div key={i} className="group relative">
                    {/* SLOT */}
                    <div className="w-28 h-28 bg-white/70 hover:bg-white backdrop-blur-xl border-3 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 hover:rotate-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-slate-200 to-gray-300 rounded-xl flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-all">
                        <span className="text-lg font-bold text-gray-700">P{i+1}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Slot {i+1}</span>
                    </div>
                    
                    {/* LINEA CONCORRENTE */}
                    <div className={`w-1 h-20 bg-emerald-300/50 absolute ${i % 2 === 0 ? 'right-1/2 transform translate-x-1/2' : 'left-1/2 transform -translate-x-1/2'} top-full rounded-full shadow-sm`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailPage;
