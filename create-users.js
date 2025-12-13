import { createClient } from '@supabase/supabase-js';

/* ===============================
   CONFIGURAZIONE SUPABASE
   =============================== */

const supabaseUrl = 'https://hfegsribygmumfdvujhh.supabase.co';

// ✅ SERVICE ROLE KEY (ORA CORRETTA – prima mancava l'apice finale)
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZWdzcmlieWdtdW1mZHZ1amhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcxNTE3MiwiZXhwIjoyMDgwMjkxMTcyfQ.uvioJND7yulXjoTk9G8rQlQFTgy6sXrYe1VwCAvWjTI';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/* ===============================
   UTENTI DEMO (NOMI REALI)
   =============================== */

const users = [
  { email: 'demo1@padel.test',  nome: 'Mario',     cognome: 'Rossi' },
  { email: 'demo2@padel.test',  nome: 'Luigi',     cognome: 'Bianchi' },
  { email: 'demo3@padel.test',  nome: 'Anna',      cognome: 'Verdi' },
  { email: 'demo4@padel.test',  nome: 'Giulia',    cognome: 'Neri' },
  { email: 'demo5@padel.test',  nome: 'Paolo',     cognome: 'Galli' },
  { email: 'demo6@padel.test',  nome: 'Laura',     cognome: 'Fontana' },
  { email: 'demo7@padel.test',  nome: 'Francesco', cognome: 'Moretti' },
  { email: 'demo8@padel.test',  nome: 'Sara',      cognome: 'Conti' },
  { email: 'demo9@padel.test',  nome: 'Davide',    cognome: 'De Luca' },
  { email: 'demo10@padel.test', nome: 'Elena',     cognome: 'Greco' },
  { email: 'demo11@padel.test', nome: 'Simone',    cognome: 'Rinaldi' },
  { email: 'demo12@padel.test', nome: 'Martina',   cognome: 'Ferrari' },
];

const PASSWORD = '!Share1968';

/* ===============================
   SCRIPT
   =============================== */

async function run() {
  console.log('🚀 Creazione utenti demo...');

  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: {
        first_name: u.nome,
        last_name: u.cognome,
        full_name: `${u.nome} ${u.cognome}`,
      },
    });

    if (error) {
      console.error(`❌ ${u.email}:`, error.message);
      continue;
    }

    console.log(`✅ Creato: ${u.nome} ${u.cognome}`);
  }

  console.log('📥 Recupero tornei...');

  const { data: tournaments, error: tErr } = await supabase
    .from('tournaments')
    .select('id');

  if (tErr) {
    console.error('❌ Errore tornei:', tErr.message);
    return;
  }

  for (const t of tournaments) {
    for (const u of users) {
      const { data: userData } =
        await supabase.auth.admin.getUserByEmail(u.email);

      if (!userData?.user) continue;

      const { error } = await supabase
        .from('tournament_registrations')
        .insert({
          tournament_id: t.id,
          user_id: userData.user.id,
          display_name: `${u.nome} ${u.cognome}`,
          full_name: `${u.nome} ${u.cognome}`,
        });

      if (error) {
        console.error(
          `❌ Iscrizione ${u.email} → ${t.id}:`,
          error.message
        );
      } else {
        console.log(`🏆 ${u.nome} ${u.cognome} iscritto al torneo ${t.id}`);
      }
    }
  }

  console.log('🎯 COMPLETATO');
}

run();
