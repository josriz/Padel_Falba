// createAdminUser.js
import { createClient } from "@supabase/supabase-js";

// ───────── CONFIG ─────────
const SUPABASE_URL = "https://lshvnwryhqlvjhxqscla.supabase.co";

// ❗ Inserisci qui la tua SERVICE_ROLE key
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaHZud3J5aHFsdmpoeHFzY2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjAyMTk4MCwiZXhwIjoyMDc3MzgxOTgwfQ.ZQAxlV5AREnSIaJwkE8wQxlN7_ZlGgfq_pA0-WYL-aw";

// Crea client Supabase con Service Role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ───────── FUNZIONE CREAZIONE UTENTE ADMIN ─────────
async function createAdminUser(email, password) {
  try {
    // Crea utente con role "admin" nel metadata
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // conferma subito l'email
      user_metadata: { role: "admin" },
    });

    if (error) {
      console.error("❌ Errore creando utente:", error);
    } else {
      console.log("✅ Utente creato con successo:", data);
    }
  } catch (err) {
    console.error("❌ Errore imprevisto:", err);
  }
}

// ───────── ESEMPIO USO ─────────
// Modifica qui email e password dell'admin
const email = "cfalba@libero.it";
const password = "!Share1968";

createAdminUser(email, password);
