import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Trophy, Users, Edit3, CheckCircle, UserPlus, Save, Play, Eye, Users2, 
  LayoutList, Calendar, Award, RefreshCw, Trash2, Plus 
} from 'lucide-react';
import { useAuth } from "../context/AuthProvider";

export default function EventiTornei() {
  const { user, isAdmin } = useAuth();
  
  // STATO COMPLETO TORNEO
  const [torneo, setTorneo] = useState({
    nome: "Torneo Open Bari 2025",
    stato: "iscrizioni_aperte", // iscrizioni_aperte | tabellone | in_corso | concluso
    maxGiocatori: 16,
    iscritti: [],
    tabellone: null
  });

  // DASHBOARD ADMIN - SEZIONI VISIBILI
  const [sezioniVisibili, setSezioniVisibili] = useState({
    iscrizioni: true,
    tabellone: false,
    risultati: false,
    statistiche: false
  });

  // UTENTE
  const [iscrizioneConfermata, setIscrizioneConfermata] = useState(false);
  const [formIscrizione, setFormIscrizione] = useState({ nome: "", livello: "Intermedio", telefono: "" });
  
  // ADMIN
  const [giornataAttiva, setGiornataAttiva] = useState(1);
  const [editingMatch, setEditingMatch] = useState(null);

  // TOGGLE SEZIONE ADMIN
  const toggleSezione = (sezione) => {
    setSezioniVisibili(prev => ({
      ...prev,
      [sezione]: !prev[sezione]
    }));
  };

  // ISCRIZIONE UTENTE
  const handleIscrizioneUtente = (e) => {
    e.preventDefault();
    const nuovoGiocatore = {
      id: Date.now(),
      ...formIscrizione,
      dataIscrizione: new Date().toLocaleDateString(),
      pagato: false,
      utenteId: user?.id
    };
    setTorneo(prev => ({
      ...prev,
      iscritti: [...prev.iscritti, nuovoGiocatore]
    }));
    setIscrizioneConfermata(true);
    setTimeout(() => setIscrizioneConfermata(false), 4000);
    setFormIscrizione({ nome: "", livello: "Intermedio", telefono: "" });
  };

  // ADMIN: CHIUDI ISCRIZIONI
  const chiudiIscrizioni = () => {
    if (torneo.iscritti.length >= 8) {
      setTorneo(prev => ({ ...prev, stato: "tabellone" }));
    }
  };

  // ADMIN: CREA TABELLONE AUTOMATICO
  const creaTabelloneAutomatico = () => {
    if (torneo.iscritti.length < 8 || torneo.iscritti.length % 2 !== 0) {
      alert("Minimo 8 giocatori, numero pari!");
      return;
    }

    // CREA COPPIE AUTOMATICHE CASUALI
    const shuffled = [...torneo.iscritti].sort(() => Math.random() - 0.5);
    const coppie = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      coppie.push([shuffled[i], shuffled[i + 1]]);
    }

    const tabellone = {
      ottaviSinistra: [
        { coppia1: coppie[0], coppia2: coppie[1], punteggio1: "", punteggio2: "", vincitore: null },
        { coppia1: coppie[2], coppia2: coppie[3], punteggio1: "", punteggio2: "", vincitore: null }
      ],
      ottaviDestra: [
        { coppia1: coppie[4], coppia2: coppie[5], punteggio1: "", punteggio2: "", vincitore: null },
        { coppia1: coppie[6], coppia2: coppie[7], punteggio1: "", punteggio2: "", vincitore: null }
      ],
      quarti: [],
      semifinali: [],
      finale: null
    };

    setTorneo(prev => ({ ...prev, stato: "in_corso", tabellone }));
    setSezioniVisibili(prev => ({ ...prev, tabellone: true, risultati: true }));
  };

  const aggiornaRisultato = (fase, index, p1, p2) => {
    setTorneo(prev => {
      const newTabellone = { ...prev.tabellone };
      newTabellone[fase][index].punteggio1 = p1;
      newTabellone[fase][index].punteggio2 = p2;
      newTabellone[fase][index].vincitore = p1 > p2 ? 1 : p2 > p1 ? 2 : null;
      return { ...prev, tabellone: newTabellone };
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER TORNEO */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border p-12 mb-12 text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-6">{torneo.nome}</h1>
          <div className="flex flex-wrap justify-center gap-8 text-xl mb-8">
            <span className="flex items-center gap-2">
              <Users className="w-8 h-8" />
              <span>{torneo.iscritti.length}/{torneo.maxGiocatori}</span>
            </span>
            <span className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg ${
              torneo.stato === 'iscrizioni_aperte' ? 'bg-blue-500 text-white' :
              torneo.stato === 'in_corso' ? 'bg-yellow-500 text-white' :
              'bg-emerald-500 text-white'
            }`}>
              {torneo.stato === 'iscrizioni_aperte' ? '📝 ISCRIZIONI APERTE' :
               torneo.stato === 'tabellone' ? '⚙️ ORGANIZZAZIONE' :
               torneo.stato === 'in_corso' ? '⚡ IN CORSO' : '🏆 CONCLUSO'}
            </span>
          </div>
        </div>

        {/* DASHBOARD ADMIN */}
        {isAdmin && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border p-6 mb-8 sticky top-4 z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ToggleButton 
                icon={Users2} label="Iscrizioni" 
                active={sezioniVisibili.iscrizioni} 
                onToggle={() => toggleSezione('iscrizioni')}
              />
              <ToggleButton 
                icon={LayoutList} label="Tabellone" 
                active={sezioniVisibili.tabellone} 
                onToggle={() => toggleSezione('tabellone')}
              />
              <ToggleButton 
                icon={Award} label="Risultati" 
                active={sezioniVisibili.risultati} 
                onToggle={() => toggleSezione('risultati')}
              />
              <ToggleButton 
                icon={Calendar} label="Statistiche" 
                active={sezioniVisibili.statistiche} 
                onToggle={() => toggleSezione('statistiche')}
              />
            </div>
            
            {/* AZIONI ADMIN */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {torneo.stato === 'iscrizioni_aperte' && torneo.iscritti.length >= 8 && (
                <button onClick={chiudiIscrizioni} 
                  className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-700 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" /> Chiudi Iscrizioni
                </button>
              )}
              {torneo.stato === 'tabellone' && (
                <button onClick={creaTabelloneAutomatico} 
                  className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 flex items-center gap-3">
                  <Play className="w-6 h-6" /> Crea Tabellone Auto
                </button>
              )}
              <button className="px-8 py-4 bg-gray-600 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-700 flex items-center gap-3">
                <Save className="w-6 h-6" /> Salva Tutto
              </button>
            </div>
          </div>
        )}

        {/* ISCRIZIONE UTENTE */}
        {torneo.stato === 'iscrizioni_aperte' && !isAdmin && (
          <div className="bg-white rounded-3xl shadow-2xl border p-12 mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-4">
              <UserPlus className="w-10 h-10 text-blue-600" />
              Iscriviti Ora
            </h2>
            <form onSubmit={handleIscrizioneUtente} className="space-y-6">
              <input 
                value={formIscrizione.nome} 
                onChange={(e) => setFormIscrizione({...formIscrizione, nome: e.target.value})}
                placeholder="Nome e Cognome" 
                className="w-full p-6 text-xl border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
              <div className="grid md:grid-cols-2 gap-6">
                <select 
                  value={formIscrizione.livello} 
                  onChange={(e) => setFormIscrizione({...formIscrizione, livello: e.target.value})}
                  className="p-6 text-xl border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Principiante</option>
                  <option>Intermedio</option>
                  <option>Avanzato</option>
                </select>
                <input 
                  value={formIscrizione.telefono} 
                  onChange={(e) => setFormIscrizione({...formIscrizione, telefono: e.target.value})}
                  placeholder="Telefono/WhatsApp" 
                  className="p-6 text-xl border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-transparent" 
                  required 
                />
              </div>
              <button type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-12 text-2xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all">
                💪 ISCRIVITI AL TORNEO (€50)
              </button>
            </form>
            {iscrizioneConfermata && (
              <div className="mt-8 p-8 bg-emerald-100 border-2 border-emerald-400 rounded-3xl text-center animate-pulse">
                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">ISCRIZIONE CONFERMATA! 🎉</h3>
                <p className="text-lg text-emerald-700">Riceverai conferma via WhatsApp entro 24h</p>
              </div>
            )}
          </div>
        )}

        {/* SEZIONE ISCRIZIONI ADMIN */}
        {sezioniVisibili.iscrizioni && (
          <SezioneIscritti torneo={torneo} setTorneo={setTorneo} />
        )}

        {/* SEZIONE TABELLONE */}
        {sezioniVisibili.tabellone && torneo.tabellone && (
          <SezioneTabellone 
            tabellone={torneo.tabellone}
            aggiornaRisultato={aggiornaRisultato}
            giornataAttiva={giornataAttiva}
            setGiornataAttiva={setGiornataAttiva}
          />
        )}
      </div>
    </div>
  );
}

// COMPONENTI UTILITÀ
function ToggleButton({ icon: Icon, label, active, onToggle }) {
  return (
    <button onClick={onToggle} 
      className={`p-4 rounded-2xl font-bold transition-all shadow-md ${
        active 
          ? 'bg-indigo-600 text-white shadow-indigo-500/50' 
          : 'bg-white text-gray-700 hover:bg-indigo-50'
      }`}
    >
      <Icon className="w-6 h-6 mx-auto mb-2" />
      <span className="text-sm">{label}</span>
    </button>
  );
}

function SezioneIscritti({ torneo, setTorneo }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border p-12 mb-12">
      <h2 className="text-4xl font-bold mb-12 flex items-center gap-4">
        <Users2 className="w-12 h-12 text-indigo-600" />
        Lista Iscritti ({torneo.iscritti.length}/{torneo.maxGiocatori})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {torneo.iscritti.map(giocatore => (
          <div key={giocatore.id} className="group p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all">
            <div className="font-black text-2xl text-gray-900 mb-2">{giocatore.nome}</div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                giocatore.livello === 'Avanzato' ? 'bg-emerald-100 text-emerald-800' :
                giocatore.livello === 'Intermedio' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {giocatore.livello}
              </div>
              <span className="text-sm text-gray-500">{giocatore.telefono}</span>
            </div>
            <div className="text-xs text-gray-500">{giocatore.dataIscrizione}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SezioneTabellone({ tabellone, aggiornaRisultato, giornataAttiva, setGiornataAttiva }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border p-12 mb-12">
      <div className="flex flex-wrap items-center gap-6 mb-12">
        <h2 className="text-4xl font-bold flex items-center gap-4">
          <LayoutList className="w-12 h-12 text-purple-600" />
          Tabellone Torneo
        </h2>
        <div className="flex gap-2">
          {[1,2,3,4].map(giorno => (
            <button key={giorno} onClick={() => setGiornataAttiva(giorno)}
              className={`px-6 py-3 font-bold rounded-xl ${
                giornataAttiva === giorno 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Giorno {giorno}
            </button>
          ))}
        </div>
      </div>
      
      {/* OTTAVI - GIORNATA 1 */}
      {giornataAttiva === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {[...tabellone.ottaviSinistra, ...tabellone.ottaviDestra].map((match, i) => (
            <CampoEditabile 
              key={`ottavi-${i}`}
              match={match}
              onUpdate={(p1, p2) => aggiornaRisultato('ottaviSinistra', Math.floor(i/2), p1, p2)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CampoEditabile({ match, onUpdate }) {
  const [p1, setP1] = useState(match.punteggio1 || "");
  const [p2, setP2] = useState(match.punteggio2 || "");

  const handleUpdate = () => {
    onUpdate(p1, p2);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-4 border-blue-200 hover:shadow-2xl transition-all group">
      <div className="text-center mb-8">
        <div className="text-xl font-bold text-gray-900 mb-4">
          {match.coppia1[0].nome} / {match.coppia1[1].nome}
        </div>
        <div className="text-4xl font-black text-gray-500 tracking-wider mb-4">VS</div>
        <div className="text-xl font-bold text-gray-900">
          {match.coppia2[0].nome} / {match.coppia2[1].nome}
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-16 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl">
        <input 
          type="number" 
          value={p1} 
          onChange={(e) => setP1(e.target.value)}
          className="w-28 text-5xl font-black text-center p-6 border-4 border-blue-400 rounded-2xl focus:border-blue-600 bg-blue-50"
          placeholder="0"
        />
        <div className="text-5xl font-black text-gray-400">VS</div>
        <input 
          type="number" 
          value={p2} 
          onChange={(e) => setP2(e.target.value)}
          className="w-28 text-5xl font-black text-center p-6 border-4 border-red-400 rounded-2xl focus:border-red-600 bg-red-50"
          placeholder="0"
        />
      </div>
      
      <button onClick={handleUpdate} 
        className="mt-8 w-full bg-emerald-600 text-white py-4 px-8 font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:bg-emerald-700 transform hover:scale-[1.02] transition-all">
        ✅ Conferma Risultato
      </button>
      
      {match.vincitore && (
        <div className={`mt-6 p-6 rounded-2xl text-center font-black text-2xl shadow-2xl ${
          match.vincitore === 1 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
            : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
        }`}>
          {match.vincitore === 1 ? '👈 PASSA IL TURNO' : '👉 PASSA IL TURNO'}
        </div>
      )}
    </div>
  );
}
