import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lshvnwryhqlvjhxqscla.supabase.co";

// IL VALORE DEVE ESSERE ESATTAMENTE QUESTO
const SUPABASE_ANON_KEY = "sb_publishable_8eQxIQ8gZb4hiZDqcA81FA_F7hMwIrt"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);