// src/utils/registerToTournament.js
import { supabase } from '../supabaseClient';

// ✅ Funzione principale di registrazione al torneo
// Ora accetta anche campi economici opzionali (amount, payment_method, payment_note),
// ma resta compatibile con le chiamate vecchie che passano solo userId e tournamentId.
export async function registerToTournament({ 
  userId, 
  tournamentId,
  amount,           // opzionale: quota iscrizione prevista
  payment_method,   // opzionale: 'manual' | 'cash' | 'bank_transfer' | 'online'
  payment_note      // opzionale: nota libera
}) {
  try {
    // ✅ Costruzione record base, identico al tuo originale
    const baseRecord = {
      user_id: userId,
      tournament_id: tournamentId
    };

    // ✅ NEW: se arrivano dati economici, li aggiungiamo al record
    // Questi campi presuppongono che in Supabase tu abbia aggiunto le relative colonne
    // nella tabella "tournament_registrations" (o in una tabella collegata).
    if (typeof amount === 'number') {
      baseRecord.amount = amount;
    }

    if (payment_method) {
      baseRecord.payment_method = payment_method;
    }

    if (payment_note) {
      baseRecord.payment_note = payment_note;
    }

    // Opzionalmente puoi prevedere uno status iniziale
    // (es. 'pending' per pagamenti manuali / da verificare)
    if (payment_method) {
      baseRecord.payment_status = 'pending'; // puoi cambiarlo quando l'admin conferma
    }

    const { data, error } = await supabase
      .from('tournament_registrations')
      .insert([baseRecord]);

    if (error) {
      return { ok: false, error };
    }
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error };
  }
}
