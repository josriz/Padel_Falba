import { supabase } from './supabaseClient';

export async function fetchTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}
