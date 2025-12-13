// register_demo_users.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfegsribygmumfdvujhh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZWdzcmlieWdtdW1mZHZ1amhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcxNTE3MiwiZXhwIjoyMDgwMjkxMTcyfQ.uvioJND7yulXjoTk9G8rQlQFTgy6sXrYe1VwCAvWjTI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const usersDemoEmails = [
  'demo1@padel.test','demo2@padel.test','demo3@padel.test','demo4@padel.test',
  'demo5@padel.test','demo6@padel.test','demo7@padel.test','demo8@padel.test',
  'demo9@padel.test','demo10@padel.test','demo11@padel.test','demo12@padel.test'
];

async function run() {
  console.log('🚀 Recupero utenti demo reali...');
  const usersMap = {};

  for (const email of usersDemoEmails) {
    try {
      const { data: userData, error } = await supabase.auth.admin.getUserByEmail(email);
      if (error) console.log(`❌ ${email} errore:`, error.message);
      else usersMap[email] = userData.id;
    } catch (err) {
      console.log(`❌ ${email} errore imprevisto:`, err.message);
    }
  }

  console.log('✅ Utenti mappati:', usersMap);

  console.log('🚀 Recupero tornei esistenti...');
  const { data: tournaments, error: tError } = await supabase.from('tournaments').select('id');
  if (tError) {
    console.log('❌ Errore recupero tornei:', tError.message);
    return;
  }

  for (const tournament of tournaments) {
    for (const email of usersDemoEmails) {
      const user_id = usersMap[email];
      if (!user_id) continue;

      try {
        const { data, error } = await supabase
          .from('tournament_registrations')
          .insert({
            tournament_id: tournament.id,
            user_id: user_id,
            display_name: email.split('@')[0],
            full_name: email.split('@')[0]
          });

        if (error) console.log(`❌ Errore iscrizione ${email}:`, error.message);
        else console.log(`✅ ${email} iscritto al torneo ${tournament.id}`);
      } catch (err) {
        console.log(`❌ Errore imprevisto iscrizione ${email}:`, err.message);
      }
    }
  }

  console.log('🎉 Tutti gli utenti demo iscritti ai tornei.');
}

run();
