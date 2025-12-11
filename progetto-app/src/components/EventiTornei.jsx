import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import PageContainer from './PageContainer';
import { Users, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function EventiTornei({ torneoId }) {
  const { user } = useAuth();
  const [torneo, setTorneo] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (torneoId) {
      fetchTorneo();
      fetchParticipants();
    }
  }, [torneoId]);

  const fetchTorneo = async () => {
    try {
      const { data } = await supabase.from('tournaments').select('*').eq('id', torneoId).single();
      setTorneo(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      console.log(`🔍 Carico iscritti per torneo ${torneoId}`);
      
      const tables = ['tournament_registrations', 'tournament_participants', 'tournament_players'];
      let allParticipants = [];
      
      // 🔥 PROVA OGNI TABELLA + OGNI COLONNA ID!
      for (const table of tables) {
        const idColumns = ['tournament_id', 'torneo_id'];
        
        for (const idColumn of idColumns) {
          try {
            const { data } = await supabase
              .from(table)
              .select('*')
              .eq(idColumn, torneoId);
            
            if (data && data.length > 0) {
              console.log(`✅ ${table} (${data.length}) con ${idColumn}`);
              allParticipants = [...allParticipants, ...data];
              break;
            }
          } catch (e) {
            console.log(`❌ ${table}.${idColumn}`);
          }
        }
      }
      
      // 🔥 NORMALIZZA NOMI
      const normalized = allParticipants.map(p => ({
        id: p.id,
        nome: p.nome || p.name || p.full_name || (p.email ? p.email.split('@')[0] : 'Giocatore'),
        cognome: p.cognome || p.surname || '',
        email: p.email || p.user_email || 'N/D',
        user_id: p.user_id,
        status: p.status || 'iscritto'
      }));
      
      const unique = normalized.filter((p, i, self) => 
        i === self.findIndex(part => part.id === p.id)
      );
      
      console.log(`🎾 ISCRITTI TOTALI (${unique.length}):`, unique.slice(0, 3));
      setParticipants(unique);
      
    } catch (err) {
      console.error('❌ fetchParticipants:', err);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIscrizione = async (e) => {
    e.preventDefault();
    if (!user) return setMessage({ type: 'error', text: 'Devi fare login!' });

    setLoading(true);
    setMessage(null);

    try {
      // 🔥 PROVA OGNI TABELLA + COLONNA!
      const tables = [
        { name: 'tournament_participants', idCol: 'tournament_id' },
        { name: 'tournament_players', idCol: 'torneo_id' }
      ];
      
      let inserted = false;
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table.name).insert({
            [table.idCol]: torneoId,
            user_id: user.id,
            nome: user.user_metadata?.name || user.email.split('@')[0],
            cognome: user.user_metadata?.surname || '',
            email: user.email,
            status: 'iscritto'
          });
          
          if (!error) {
            console.log(`✅ Iscritto in ${table.name}`);
            inserted = true;
            break;
          }
        } catch (err) {
          console.log(`❌ ${table.name}:`, err.message);
        }
      }
      
      if (!inserted) throw new Error('Nessuna tabella accetta iscrizioni');
      
      setMessage({ type: 'success', text: `✅ Iscrizione avvenuta! Prezzo: €${torneo?.price || 0}` });
      fetchParticipants(); // Refresh lista
      
    } catch (err) {
      setMessage({ type: 'error', text: `❌ Errore: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <PageContainer title="Eventi e Tornei">
      <div className="text-center py-12"><Loader2 className="w-10 h-10 animate-spin mx-auto" /> Caricamento...</div>
    </PageContainer>
  );

  return (
    <PageContainer title="Eventi e Tornei">
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {torneo && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold mb-2">{torneo.name}</h1>
            <p>📅 Data: {torneo.created_at ? new Date(torneo.created_at).toLocaleDateString('it-IT') : 'N/D'}</p>
            <p>💰 Prezzo: €{torneo.price || 0}</p>
            <p>👥 Max giocatori: {torneo.max_players || 16}</p>
            <p>Status: {torneo.status || 'aperto'}</p>

            <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between text-sm">
                <span>👥 Iscritti: {participants.length}/{torneo.max_players || 16}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  participants.length >= (torneo.max_players || 16) 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {participants.length >= (torneo.max_players || 16) ? 'COMPLETO' : 'APERTI'}
                </span>
              </div>
            </div>

            {torneo.status === 'pianificato' && 
             user && 
             participants.length < (torneo.max_players || 16) &&
             !participants.find(p => p.user_id === user.id) && (
              <button 
                onClick={handleIscrizione} 
                disabled={loading}
                className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                Iscriviti Ora
              </button>
            )}

            {message && (
              <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 shadow-sm ${
                message.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
                <span className="font-medium">{message.text}</span>
              </div>
            )}
          </div>
        )}

        {participants.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Iscritti ({participants.length})
            </h2>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-w-[400px]">
                {participants.map(p => (
                  <div key={p.id} className="border p-4 rounded-xl hover:shadow-md transition-all bg-gradient-to-r from-slate-50 to-gray-100">
                    <div className="font-bold text-gray-900">{p.nome} {p.cognome}</div>
                    <div className="text-sm text-gray-600 truncate">{p.email}</div>
                    <div className="text-xs text-gray-500 mt-1">{p.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
