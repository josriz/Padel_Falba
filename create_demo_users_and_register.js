import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const demoUsers = [
  { email: 'demo1@padel.test', first_name: 'Mario', last_name: 'Rossi' },
  { email: 'demo2@padel.test', first_name: 'Luca', last_name: 'Bianchi' },
  { email: 'demo3@padel.test', first_name: 'Giulia', last_name: 'Verdi' },
  { email: 'demo4@padel.test', first_name: 'Anna', last_name: 'Neri' },
  { email: 'demo5@padel.test', first_name: 'Paolo', last_name: 'Gialli' },
  { email: 'demo6@padel.test', first_name: 'Sara', last_name: 'Blu' },
  { email: 'demo7@padel.test', first_name: 'Marco', last_name: 'Arancio' },
  { email: 'demo8@padel.test', first_name: 'Elena', last_name: 'Viola' },
  { email: 'demo9@padel.test', first_name: 'Federico', last_name: 'Rosa' },
  { email: 'demo10@padel.test', first_name: 'Laura', last_name: 'Grigio' },
  { email: 'demo11@padel.test', first_name: 'Stefano', last_name: 'Marrone' },
  { email: 'demo12@padel.test', first_name: 'Chiara', last_name: 'Celeste' },
];

const PASSWORD = '!Share1968';

async function run() {
  console.log('🚀 Creazione utenti demo...');
  
  const createdUsers = [];

  for (const u of demoUsers) {
    try {
      // Creazione utente
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: {
          first_name: u.first_name,
          last_name: u.last_name,
        },
      });

      if (error) {
        console.log(`❌ ${u.email} errore:`, error.message);
      } else {
        console.log(`✅ ${u.email} creato`);
        createdUsers.push({ ...u, id: data.user.id });
      }
    } catch (err) {
      console.log(`❌ ${u.email} errore imprevisto:`, err.message);
    }
  }

  if (createdUsers.length === 0) {
    console.log('⚠️ Nessun utente creato, procedo con utenti esistenti nel DB');
  }

  // Recupero tutti i tornei esistenti
  const { data: tournaments, error: tErr } = await supabase
    .from('tournaments')
    .select('id');

  if (tErr) {
    console.error('❌ Errore fetch tornei:', tErr);
    return;
  }

  console.log(`🏟️ Tornei trovati: ${tournaments.length}`);

  // Registrazione utenti demo a tutti i tornei
  for (const t of tournaments) {
    for (const u of createdUsers) {
      try {
        const { data, error } = await supabase
          .from('tournament_registrations')
          .insert({
            tournament_id: t.id,
            user_id: u.id,
            display_name: `${u.first_name} ${u.last_name}`,
            full_name: `${u.first_name} ${u.last_name}`,
          });

        if (error) {
          if (error.code === '23505') {
            console.log(`⚠️ ${u.email} già registrato nel torneo ${t.id}`);
          } else {
            console.log(`❌ Errore registrazione ${u.email} torneo ${t.id}:`, error.message);
          }
        } else {
          console.log(`✅ ${u.email} registrato al torneo ${t.id}`);
        }
      } catch (err) {
        console.log(`❌ Errore imprevisto registrazione ${u.email} torneo ${t.id}:`, err.message);
      }
    }
  }

  console.log('🎯 Operazione completata!');
}

run();
