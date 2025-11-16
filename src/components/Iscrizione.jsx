import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Iscrizione() {
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '' });
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    // Controlla email duplicata
    const { data: existing, error: err1 } = await supabase
      .from('tournament_players')
      .select('email')
      .eq('email', form.email);

    if (err1) {
      setMessage('Errore controllo email');
      return;
    }

    if (existing.length > 0) {
      setMessage('Email già iscritta');
      return;
    }

    // Inserisci giocatore (aggiungi user_id se usi auth)
    const { data, error } = await supabase.from('tournament_players').insert([form]);

    if (error) {
      setMessage('Errore iscrizione: ' + error.message);
    } else {
      setMessage('Iscrizione effettuata con successo!');
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nome" onChange={handleChange} required />
      <input name="surname" placeholder="Cognome" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="phone" placeholder="Telefono" onChange={handleChange} />
      <button type="submit">Iscriviti</button>
      {message && <p>{message}</p>}
    </form>
  );
}
