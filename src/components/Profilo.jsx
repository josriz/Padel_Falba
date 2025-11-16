import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Profilo({ user }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState(''); // nuovo campo
  const [message, setMessage] = useState('');

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    getProfile();
  }, [userId]);

  async function getProfile() {
    setLoading(true);
    setMessage('');
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, phone`)
        .eq('id', userId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setPhone(data.phone); // recupera nuova proprietà
      }
    } catch (error) {
      setMessage('Errore nel caricamento del profilo. Potrebbe non esistere.');
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const updates = {
      id: userId,
      username,
      website,
      avatar_url: avatarUrl,
      phone, // salva nuova proprietà
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('profiles').upsert([updates], { onConflict: 'id' });
      if (error) throw error;
      setMessage('✅ Profilo aggiornato con successo!');
    } catch (error) {
      setMessage(`❌ Errore nell'aggiornamento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="max-w-lg mx-auto p-6 text-center text-gray-600">Caricamento profilo...</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">👤 Gestione Profilo</h2>

      {message && (
        <p
          className={`mb-6 p-3 rounded font-semibold ${
            message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={updateProfile} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={user?.email || ''}
            disabled
            className="w-full p-3 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Nome Utente
          </label>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Sito Web (Opzionale)
          </label>
          <input
            id="website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 mb-1">
            URL Avatar (Immagine Profilo)
          </label>
          <input
            id="avatar_url"
            type="url"
            value={avatarUrl || ''}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Inserisci un URL immagine"
            className="w-full p-3 border border-gray-300 rounded"
          />
          {avatarUrl && (
            <img alt="Avatar Preview" src={avatarUrl} className="mt-3 w-24 h-24 rounded-full object-cover" />
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefono
          </label>
          <input
            id="phone"
            type="tel"
            value={phone || ''}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded shadow disabled:opacity-50"
        >
          {loading ? 'Aggiornamento...' : 'Aggiorna Profilo'}
        </button>
      </form>
    </div>
  );
}
