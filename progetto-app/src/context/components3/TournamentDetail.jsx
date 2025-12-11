import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Users, MapPin, Trophy, ArrowLeft, Star, Filter } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

export default function TournamentList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ level: 'tutti', status: 'tutti' });
  const [search, setSearch] = useState('');

  // Dati demo (sostituisci con Supabase)
  useEffect(() => {
    setTimeout(() => {
      setTournaments([
        {
          id: 1, name: "Bari Padel Open 2025", date: "15-20 Dic", location: "Padel Club Bari",
          players: 28, max_players: 32, level: "Avanzato", prize: "€500", status: "Iscrizioni aperte",
          image: "https://images.unsplash.com/photo-1596964358105-e4329c0836d8?w=400"
        },
        {
          id: 2, name: "Campionato Regionale Puglia", date: "28 Dic - 5 Gen", location: "Centro Sportivo",
          players: 12, max_players: 64, level: "Intermedio", prize: "€1.200", status: "Prossimo",
          image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"
        },
        {
          id: 3, name: "Natale Padel JR4C", date: "24-26 Dic", location: "JR4C Padel Club",
          players: 8, max_players: 16, level: "Principianti", prize: "Coppe", status: "Iscrizioni aperte",
          image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c93?w=400"
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredTournaments = tournaments.filter(t => {
    const matchesLevel = filters.level === 'tutti' || t.level.toLowerCase() === filters.level;
    const matchesStatus = filters.status === 'tutti' || t.status.toLowerCase() === filters.status.toLowerCase();
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white hover:shadow-md transition-all mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Indietro
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Tornei Padel
              </h1>
              <p className="text-gray-600">Scopri i tornei disponibili a Bari e Puglia</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cerca torneo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filtri */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/50 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 flex-1">
              <Filter className="w-4 h-4" />
              Filtri ({filteredTournaments.length} tornei)
            </div>
            <div className="flex flex-wrap gap-2">
              <select 
                value={filters.level} 
                onChange={(e) => setFilters({...filters, level: e.target.value})}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="tutti">Tutti i livelli</option>
                <option value="principianti">Principianti</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzato">Avanzato</option>
              </select>
              <select 
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="tutti">Tutti gli stati</option>
                <option value="Iscrizioni aperte">Iscrizioni aperte</option>
                <option value="Prossimo">Prossimo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Griglia Tornei */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-6 animate-pulse border border-white/50">
                <div className="h-32 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2 mb-6">
                  {[...Array(3)].map((_, j) => <div key={j} className="h-3 bg-gray-200 rounded w-full"></div>)}
                </div>
                <div className="h-10 bg-gray-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <Link 
                key={tournament.id}
                to={`/events/${tournament.id}`}
                className="group block bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-6 hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 border border-white/50 hover:border-blue-200"
              >
                <div className="w-full h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200/50 to-transparent"></div>
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {tournament.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tournament.status === 'Iscrizioni aperte' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {tournament.status}
                    </span>
                  </div>
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="space-y-3 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {tournament.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {tournament.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {tournament.players}/{tournament.max_players} giocatori
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tournament.level === 'Avanzato' ? 'bg-red-100 text-red-800' :
                    tournament.level === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {tournament.level}
                  </div>
                  {tournament.prize && (
                    <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      {tournament.prize}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nessun torneo trovato</h3>
            <p className="text-gray-600 mb-6">{search ? 'Prova con altre parole' : 'Modifica i filtri'}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => {setFilters({level: 'tutti', status: 'tutti'}); setSearch('');}}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              >
                Reset filtri
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
