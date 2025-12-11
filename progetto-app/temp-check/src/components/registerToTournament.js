// src/utils/registerToTournament.js
import { supabase } from '../supabaseClient';

export async function registerToTournament({ userId, tournamentId }) {
  try {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .insert([{ user_id: userId, tournament_id: tournamentId }]);

    if (error) {
      return { ok: false, error };
    }
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error };
  }
}
