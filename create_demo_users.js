import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const demoUsers = [
  'demo1@padel.test','demo2@padel.test','demo3@padel.test','demo4@padel.test',
  'demo5@padel.test','demo6@padel.test','demo7@padel.test','demo8@padel.test',
  'demo9@padel.test','demo10@padel.test','demo11@padel.test','demo12@padel.test'
];

async function createDemoUsers() {
  for (const email of demoUsers) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: '!Share1968',
      email_confirm: true
    });
    if (error) console.log(`❌ ${email} errore:`, error.message);
    else console.log(`✅ ${email} creato con ID: ${data.id}`);
  }
}

createDemoUsers();
