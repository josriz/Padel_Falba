// src/reset-passwords.js - RESET PASSWORD UTENTI DA BACKEND
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ⚠️ SOLO SERVER — MAI METTERE SERVICE_ROLE SUL CLIENT!
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 📌 Lista utenti da resettare
const usersToReset = [
  { email: 'giose.rizzi@gmail.com', newPassword: '123456' },
  { email: 'cfalba@libero.it', newPassword: '123456' },
  { email: 'boverob@libero.it', newPassword: '123456' }
];

// Funzione per ottenere tutti gli utenti con paginazione
async function listAllUsers() {
  let allUsers = [];
  let page = 0;
  const perPage = 100;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    allUsers = allUsers.concat(data.users);

    if (!data.has_more) break;
    page += 1;
  }

  return allUsers;
}

async function resetPasswords() {
  console.log('🔄 Inizio reset password...');

  try {
    const allUsers = await listAllUsers();

    for (const u of usersToReset) {
      const found = allUsers.find(x => x.email === u.email);
      if (!found) {
        console.log(`⚠️ Utente non trovato: ${u.email}`);
        continue;
      }

      const { error: updateErr } = await supabase.auth.admin.updateUserById(found.id, {
        password: u.newPassword
      });

      if (updateErr) {
        console.log(`❌ Errore aggiornando ${u.email}:`, updateErr.message);
      } else {
        console.log(`✅ Password aggiornata: ${u.email}`);
      }
    }

  } catch (err) {
    console.error('❌ ERRORE GENERALE:', err.message);
  }

  console.log('🏁 Reset password completato!');
}

resetPasswords();
