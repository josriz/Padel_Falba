// create-users.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createUser(email, password) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    console.log(`❌ ERRORE per ${email}:`, error.message);
  } else {
    console.log(`✅ Utente creato: ${email}`);
  }
}

async function main() {
  await createUser("giose.rizzi@gmail.com", "!Share1968");
  await createUser("boverob@libero.it", "!Share1968");
  await createUser("cfalba@libero.it", "!Share1968");

  console.log("🎉 FINITO!");
}

main();
