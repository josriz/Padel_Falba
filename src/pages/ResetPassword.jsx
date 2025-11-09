import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password'
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Se l\'email esiste, una mail con il link per resettare la password è stata inviata.');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleResetRequest}>
      <input
        type="email"
        placeholder="Inserisci la tua email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Invio...' : 'Resetta la Password'}
      </button>
      {message && <p style={{color:'green'}}>{message}</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
