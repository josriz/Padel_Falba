import { supabase } from "../supabaseClient"

export async function fetchTournaments() {
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("data_inizio", { ascending: true })

  if (error) throw error
  return data
}
