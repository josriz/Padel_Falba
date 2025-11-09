// createAdminUser.js
// ⚠️ ESEGUI SOLO LATO SERVER (Node.js)
// ⚠️ NON METTERE QUESTA SERVICE ROLE KEY NEL FRONTEND

import { createClient } from "@supabase/supabase-js";

// --- Configurazione ---
const SUPABASE_URL = "https://lshvnwryhqlvjhxqscla.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaHZud3J5aHFsdmpoeHFzY2xhIiwicm9yZV9yb2xlIiwiaWF0IjoxNzYyMDIxOTgwLCJleHAiOjIwNzczODE5ODB9.ZQAxlV5AREnSIaJwkE8wQxlN7_ZlGgfq_pA0-WYL-aw";

const ADMIN_EMAIL = "cfalba@libero.it";
const ADMIN_PASSWORD = "!Share1968";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createAdminUser() {
  try {
    // 1️⃣ Crea utente
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // conferma automatica
    });

    if (createError) {
      console.error("❌ Errore creando utente:", createError);
      return;
    }

    console.log("✅ Utente creato:", userData);

    // 2️⃣ Imposta ruolo admin nella tabella profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userData.id,
        email: ADMIN_EMAIL,
        role: "admin",
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("❌ Errore aggiornando profilo:", profileError);
      return;
    }

    console.log("✅ Profilo aggiornato come admin:", profileData);
  } catch (err) {
    console.error("❌ Errore nello script:", err);
  }
}

createAdminUser();
