// src/utils/TournamentUtils.js
import { supabase } from '../supabaseClient';

export async function fetchTournaments() {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Errore fetchTournaments:', err.message || err);
    return [];
  }
}
