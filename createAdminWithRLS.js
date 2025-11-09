import { createClient } from "@supabase/supabase-js";

// 🔹 Inserisci qui la tua URL Supabase e la Service Role Key
const SUPABASE_URL = "https://lshvnwryhqlvjhxqscla.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaHZud3J5aHFsdmpoeHFzY2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjAyMTk4MCwiZXhwIjoyMDc3MzgxOTgwfQ.ZQAxlV5AREnSIaJwkE8wQxlN7_ZlGgfq_pA0-WYL-aw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const adminEmail = "cfalba@libero.it";   // 🔹 Cambia con l’email desiderata
const adminPassword = "!Share1968";      // 🔹 Cambia con la password desiderata

async function toggleRLS(enable) {
  const sql = `
    DO $$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
        LOOP
            EXECUTE format('ALTER TABLE public.%I %s ROW LEVEL SECURITY;', r.table_name, $1);
            RAISE NOTICE 'RLS % su tabella: %', $1, r.table_name;
        END LOOP;
    END$$;
  `;

  const { error } = await supabase.rpc("exec_sql", { sql_query: sql, param: enable ? 'ENABLE' : 'DISABLE' });
  if (error) console.log(`Errore ${enable ? 'abilitando' : 'disabilitando'} RLS:`, error.message);
  else console.log(`RLS ${enable ? 'abilitata' : 'disabilitata'} su tutte le tabelle`);
}

async function createAdminUser() {
  try {
    // 🔹 Disabilita RLS
    console.log("Disabilito temporaneamente RLS...");
    await supabase.from("pg_execute_sql").insert({ sql: "ALTER TABLE public DISABLE ROW LEVEL SECURITY;" });

    // 🔹 Crea l’utente admin
    console.log("Creo utente admin...");
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });

    if (error) {
      console.error("❌ Errore creando utente:", error);
    } else {
      console.log("✅ Utente creato:", data);
    }

    // 🔹 Riabilita RLS
    console.log("Riabilito RLS...");
    await supabase.from("pg_execute_sql").insert({ sql: "ALTER TABLE public ENABLE ROW LEVEL SECURITY;" });

    console.log("Fatto! Admin creato e RLS ripristinata.");
  } catch (err) {
    console.error("Errore generale:", err);
  }
}

createAdminUser();
