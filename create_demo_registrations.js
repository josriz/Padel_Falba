import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfegsribygmumfdvujhh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZWdzcmlieWdtdW1mZHZ1amhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcxNTE3MiwiZXhwIjoyMDgwMjkxMTcyfQ.uvioJND7yulXjoTk9G8rQlQFTgy6sXrYe1VwCAvWjTI';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const demoUsers = [
  { email: 'demo1@padel.test', nome: 'Mario', cognome: 'Rossi' },
  { email: 'demo2@padel.test', nome: 'Luigi', cognome: 'Bianchi' },
  { email: 'demo3@padel.test', nome: 'Anna', cognome: 'Verdi' },
  { email: 'demo4@padel.test', nome: 'Giulia', cognome: 'Neri' },
  { email: 'demo5@padel.test', nome: 'Paolo', cognome: 'Galli' },
  { email: 'demo6@padel.test', nome: 'Laura', cognome: 'Fontana' },
  { email: 'demo7@padel.test', nome: 'Francesco', cognome: 'Moretti' },
  { email: 'demo8@padel.test', nome: 'Sara', cognome: 'Conti' },
  { email: 'demo9@padel.test', nome: 'Davide', cognome: 'De Luca' },
  { email: 'demo10@padel.test', nome: 'Elena', cognome: 'Greco' },
  { email: 'demo11@padel.test', nome: 'Simone', cognome: 'Rinaldi' },
  { email: 'demo12@padel.test', nome: 'Martina', cognome: 'Ferrari' },
];

async function run() {
  console.log('🚀 Iscrizione utenti demo ai tornei...');

  // Prendi tutti i tornei
  const { data: tournaments, error: tErr } = await supabase.from('tournaments').select('id');
  if (tErr) return console.error('❌ Errore recupero tornei:', tErr.message);

  for (const user of demoUsers) {
    const { data: uData, error: uErr } = await supabase.auth.admin.getUserByEmail(user.email);
    if (uErr || !uData?.user) {
      console.error(`❌ Utente non trovato: ${user.email}`, uErr?.message);
      continue;
    }
    const userId = uData.user.id;

    for (const t of tournaments) {
      const { error: regErr } = await supabase
        .from('tournament_registrations')
        .upsert({
          tournament_id: t.id,
          user_id: userId,
          display_name: `${user.nome} ${user.cognome}`,
          full_name: `${user.nome} ${user.cognome}`,
        }, { onConflict: ['tournament_id', 'user_id'] }); // evita duplicati

      if (regErr) {
        console.error(`❌ Iscrizione ${user.email} → torneo ${t.id}:`, regErr.message);
      } else {
        console.log(`🏆 ${user.nome} ${user.cognome} iscritto al torneo ${t.id}`);
      }
    }
  }

  console.log('🎯 COMPLETATO');
}

run();
