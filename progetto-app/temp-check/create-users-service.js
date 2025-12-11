// create-users-service.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // carica le variabili da .env

// Usa la chiave SERVICE_ROLE, mai ANON
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const users = [
  { email: 'boverob@libero.it', password: '!Share1968' },
  { email: 'cfalba@libero.it', password: '!Share1968' }
];

async function createUsers() {
  for (const u of users) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,   // conferma email automatica
        user_metadata: { role: 'user' }
      });

      if (error) {
        console.log(`❌ ERRORE per ${u.email}:`, error.message);
      } else {
        console.log(`✅ Utente creato: ${u.email}`);
      }
    } catch (err) {
      console.log(`❌ ERRORE per ${u.email}:`, err.message);
    }
  }

  console.log('🎉 FINITO!');
}

createUsers();
