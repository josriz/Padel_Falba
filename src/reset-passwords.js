// src/reset-passwords.js - RESET PASSWORD UTENTI DA BACKEND
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ⚠️ USA SOLO LATO SERVER — MAI METTERE SERVICE_ROLE SUL CLIENT!
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 📌 Lista utenti da resettare
const users = [
  { email: 'giose.rizzi@gmail.com', newPassword: '123456' },
  { email: 'cfalba@libero.it', newPassword: '123456' },
  { email: 'boverob@libero.it', newPassword: '123456' }
];

async function resetPasswords() {
  console.log('🔄 Inizio reset password...');

  for (const u of users) {
    try {
      // Recupero ID utente
      const { data: userData, error: userErr } = await supabase.auth.admin.listUsers();
      if (userErr) throw userErr;

      const found = userData.users.find(x => x.email === u.email);
      if (!found) {
        console.log(`⚠️ Utente non trovato: ${u.email}`);
        continue;
      }

      // Modifico la password
      const { error: updateErr } = await supabase.auth.admin.updateUserById(found.id, {
        password: u.newPassword
      });

      if (updateErr) {
        console.log(`❌ Errore aggiornando ${u.email}:`, updateErr.message);
      } else {
        console.log(`✅ Password aggiornata: ${u.email}`);
      }

    } catch (err) {
      console.error(`❌ ERRORE GENERALE su ${u.email}:`, err.message);
    }
  }

  console.log('🏁 Reset password completato!');
}

resetPasswords();
