import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lshvnwryhqlvjhxqscla.supabase.co";
const SERVICE_ROLE_KEY = "INSERISCI_LA_TUA_SERVICE_ROLE_KEY_QUI";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function testKey() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error("❌ Chiave non valida o policy bloccano:", error);
    } else {
      console.log("✅ Chiave valida, utenti:", data);
    }
  } catch (err) {
    console.error("❌ Errore generico:", err);
  }
}

testKey();
