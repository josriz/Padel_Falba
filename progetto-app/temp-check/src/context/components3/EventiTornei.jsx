import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trophy, Users, Edit3, CheckCircle, UserPlus, Save, Play } from 'lucide-react';
import { useAuth } from "../context/AuthProvider";

export default function EventiTornei() {
  const { user, isAdmin } = useAuth();
  
  // STATO TORNEO COMPLETO
  const [torneo, setTorneo] = useState({
    nome: "Torneo Open Bari 2025",
    stato: "iscrizioni_aperte", // iscrizioni_aperte | tabellone | in_corso | concluso
    maxGiocatori: 16,
    iscritti: []
  });

  const [mostraIscrizioni, setMostraIscrizioni] = useState(true);
  const [mostraTabellone, setMostraTabellone] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  // FORM ISCRIZIONE
  const [formIscrizione, setFormIscrizione] = useState({ nome: "", livello: "Intermedio", telefono: "" });

  // GIORNATA ATTIVA (per simulare campi)
  const [giornataAttiva, setGiornataAttiva] = useState(1);

  // FUNZIONI PRINCIPALI
  const handleIscrizione = (e) => {
    e.preventDefault();
    const nuovoGiocatore = {
      id: Date.now(),
      ...formIscrizione,
      dataIscrizione: new Date().toLocaleDateString()
    };
    setTorneo({
      ...torneo,
      iscritti: [...torneo.iscritti, nuovoGiocatore]
    });
    setFormIscrizione({ nome: "", livello: "Intermedio", telefono: "" });
  };

  const chiudiIscrizioni = () => {
    if (torneo.iscritti.length >= 8) {
      setTorneo({ ...torneo, stato: "tabellone" });
      setMostraIscrizioni(false);
      setMostraTabellone(true);
    }
  };

  const creaTabelloneAutomatico = () => {
    if (torneo.iscritti.length % 2 !== 0) return alert("Numero dispari giocatori!");
    
    // CREA COPPIE AUTOMATICHE
    const coppie = [];
    for (let i = 0; i < torneo.iscritti.length; i += 2) {
      coppie.push([torneo.iscritti[i], torneo.iscritti[i + 1]]);
    }

    // OTTAVI (8 coppie → 4 vincitori)
    const ottaviSinistra = [
      { coppia1: coppie[0], coppia2: coppie[1], punteggio1: "", punteggio2: "", vincitore: null },
      { coppia1: coppie[2], coppia2: coppie[3], punteggio1: "", punteggio2: "", vincitore: null }
    ];
    const ottaviDestra = [
      { coppia1: coppie[4], coppia2: coppie[5], punteggio1: "", punteggio2: "", vincitore: null },
      { coppia1: coppie[6], coppia2: coppie[7], punteggio1: "", punteggio2: "", vincitore: null }
    ];

    setTorneo({
      ...torneo,
      stato: "in_corso",
      tabellone: {
        ottaviSinistra,
        ottaviDestra,
        quartiSinistra: [{ coppia1: null, coppia2: null, punteggio1: "", punteggio2: "", vincitore: null }],
        quartiDestra: [{ coppia1: null, coppia2: null, punteggio1: "", punteggio2: "", vincitore: null }],
        finale: { coppia1: null, coppia2: null, punteggio1: "", punteggio2: "", vincitore: null }
      }
    });
  };

  const aggiornaRisultato = (fase, index, p1, p2) => {
    const newTabellone = { ...torneo.tabellone };
    newTabellone[fase][index].punteggio1 = p1;
    newTabellone[fase][index].punteggio2 = p2;
    newTabellone[fase][index].vincitore = p1 > p2 ? 1 : p2 > p1 ? 2 : null;
    setTorneo({ ...torneo, tabellone: newTabellone });
  };

  // CAMPI ATTIVI IN BASE A GIORNATA
  const getCampiAttivi = () => {
    switch (giornataAttiva) {
      case 1: return 4; // Ottavi
      case 2: return 2; // Quarti  
      case 3: return 1; // Semifinale (se ce ne fosse)
      case 4: return 1; // Finale
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER TORNEO */}
        <div className="bg-white rounded-2xl shadow-lg border p-8 mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{torneo.nome}</h1>
          <div className="flex flex-wrap justify-center gap-6 text-xl mb-8">
            <span>👥 {torneo.iscritti.length}/{torneo.maxGiocatori} iscritti</span>
            <span className={`px-6 py-3 rounded-2xl font-bold text-lg ${
              torneo.stato === 'iscrizioni_aperte' ? 'bg-blue-100 text-blue-800' :
              torneo.stato === 'in_corso' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {torneo.stato === 'iscrizioni_aperte' ? '📝 ISCRIZIONI APERTE' :
               torneo.stato === 'tabellone' ? '⚙️ TABELLONE' :
               torneo.stato === 'in_corso' ? '⚡ IN CORSO' : '🏆 CONCLUSO'}
            </span>
          </div>

          {/* ADMIN CONTROLLI */}
          {isAdmin && (
            <div className="flex flex-wrap gap-4 justify-center">
              {torneo.stato === 'iscrizioni_aperte' && (
                <button onClick={chiudiIscrizioni} 
                  disabled={torneo.iscritti.length < 8}
                  className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 disabled:opacity-50">
                  <CheckCircle className="w-5 h-5 inline mr-2" /> Chiudi Iscrizioni
                </button>
              )}
              {torneo.stato === 'tabellone' && (
                <button onClick={creaTabelloneAutomatico} 
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 flex items-center">
                  <Play className="w-5 h-5 inline mr-2" /> Crea Tabellone Auto
                </button>
              )}
            </div>
          )}
        </div>

        {/* ISCRIZIONI */}
        {mostraIscrizioni && torneo.stato === 'iscrizioni_aperte' && (
          <div className="bg-white rounded-2xl shadow-lg border p-8 mb-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <Users className="w-8 h-8 mr-3" /> Gestione Iscrizioni
            </h2>
            
            {/* FORM ISCRIZIONE */}
            <form onSubmit={handleIscrizione} className="grid md:grid-cols-3 gap-6 mb-8 p-6 bg-blue-50 rounded-xl">
              <input 
                value={formIscrizione.nome} onChange={(e) => setFormIscrizione({...formIscrizione, nome: e.target.value})}
                placeholder="Nome Cognome" className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500" required 
              />
              <select value={formIscrizione.livello} onChange={(e) => setFormIscrizione({...formIscrizione, livello: e.target.value})} className="p-4 border rounded-xl">
                <option>Principiante</option>
                <option>Intermedio</option>
                <option>Avanzato</option>
              </select>
              <input 
                value={formIscrizione.telefono} onChange={(e) => setFormIscrizione({...formIscrizione, telefono: e.target.value})}
                placeholder="Telefono" className="p-4 border rounded-xl focus:ring-2 focus:ring-blue-500" required 
              />
              <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-4 px-8 font-bold rounded-xl hover:bg-blue-700">
                + Aggiungi Giocatore
              </button>
            </form>

            {/* LISTA ISCRITTI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {torneo.iscritti.map(giocatore => (
                <div key={giocatore.id} className="p-4 bg-gray-50 rounded-xl border hover:bg-white">
                  <div className="font-bold text-gray-900">{giocatore.nome}</div>
                  <div className="text-sm text-gray-600">{giocatore.livello}</div>
                  <div className="text-sm text-gray-500">{giocatore.telefono}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABELLONE EDITABILE */}
        {mostraTabellone && torneo.tabellone && (
          <div className="bg-white rounded-2xl shadow-lg border p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Tabellone {getCampiAttivi()} Campi</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-200 rounded-xl font-medium">Giorno {giornataAttiva}</button>
                {isAdmin && (
                  <button className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700">
                    <Save className="w-4 h-4 inline mr-2" /> Salva Risultati
                  </button>
                )}
              </div>
            </div>

            {/* OTTAVI - 4 CAMPI */}
            {giornataAttiva === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {torneo.tabellone.ottaviSinistra.map((match, i) => (
                  <CampoEditabile key={`ott-sin-${i}`} match={match} 
                    onUpdate={(p1, p2) => aggiornaRisultato('ottaviSinistra', i, p1, p2)} 
                    isAdmin={isAdmin} />
                ))}
                {torneo.tabellone.ottaviDestra.map((match, i) => (
                  <CampoEditabile key={`ott-des-${i}`} match={match} 
                    onUpdate={(p1, p2) => aggiornaRisultato('ottaviDestra', i, p1, p2)} 
                    isAdmin={isAdmin} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// COMPONENTE CAMPO EDITABILE
function CampoEditabile({ match, onUpdate, isAdmin }) {
  const [p1, setP1] = useState(match.punteggio1 || "");
  const [p2, setP2] = useState(match.punteggio2 || "");

  const handleUpdate = () => {
    onUpdate(p1, p2);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200 hover:shadow-xl transition-all">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {match.coppia1[0].nome} / {match.coppia1[1].nome}
        </div>
        <div className="text-2xl font-bold text-gray-900">
          VS
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-4">
          {match.coppia2[0].nome} / {match.coppia2[1].nome}
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-12 p-6 bg-white rounded-xl shadow-lg">
        {isAdmin ? (
          <>
            <input 
              type="number" value={p1} onChange={(e) => setP1(e.target.value)}
              className="w-24 text-3xl font-black text-center p-4 border-4 border-blue-300 rounded-xl focus:border-blue-500"
            />
            <div className="text-3xl font-bold text-gray-400">VS</div>
            <input 
              type="number" value={p2} onChange={(e) => setP2(e.target.value)}
              className="w-24 text-3xl font-black text-center p-4 border-4 border-red-300 rounded-xl focus:border-red-500"
            />
          </>
        ) : (
          <>
            <div className="text-4xl font-black text-blue-600">{p1 || "?"}</div>
            <div className="text-3xl font-bold text-gray-400">VS</div>
            <div className="text-4xl font-black text-red-600">{p2 || "?"}</div>
          </>
        )}
      </div>
      
      {isAdmin && (
        <button onClick={handleUpdate} 
          className="mt-6 w-full bg-emerald-600 text-white py-3 px-6 font-bold rounded-xl hover:bg-emerald-700 flex items-center justify-center">
          <CheckCircle className="w-5 h-5 mr-2" /> Conferma Risultato
        </button>
      )}
      
      {match.vincitore && (
        <div className={`mt-4 p-4 rounded-xl text-center font-bold text-xl ${
          match.vincitore === 1 ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {match.vincitore === 1 ? '👈 Avanza' : '👉 Avanza'}
        </div>
      )}
    </div>
  );
}
