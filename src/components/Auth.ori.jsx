import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '' });
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.surname || !form.email || !form.phone) {
      setMessage('Compila tutti i campi');
      return;
    }

    try {
      const { error } = await supabase
        .from('tournament_players')
        .insert([{ ...form, created_at: new Date().toISOString() }]);
      
      if (error) {
        setMessage('❌ Errore iscrizione: ' + error.message);
      } else {
        setMessage('✅ Iscrizione avvenuta!');
        setForm({ name: '', surname: '', email: '', phone: '' });
      }
    } catch (err) {
      setMessage('❌ Errore imprevisto: ' + err.message);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Iscriviti al torneo</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Cognome"
          value={form.surname}
          onChange={(e) => setForm({ ...form, surname: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Cellulare"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Iscriviti
        </button>
      </form>
      {message && <p className={`mt-3 ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
    </div>
  );
}
