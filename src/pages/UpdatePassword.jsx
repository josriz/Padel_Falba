import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    // Recupera access_token dall'URL hash dopo il redirect del reset password
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', '?'));
    const token = params.get('access_token');
    setAccessToken(token);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!accessToken) {
      setError('Token di reset non valido o scaduto');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) setError(error.message);
    else setMessage('Password aggiornata con successo! Ora puoi effettuare il login.');
  };

  return (
    <form onSubmit={handleUpdate}>
      <input
        type="password"
        placeholder="Nuova Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Aggiornamento...' : 'Aggiorna Password'}
      </button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
