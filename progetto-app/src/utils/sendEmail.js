// src/utils/sendEmail.js
export async function sendMatchNotification(toEmail, torneoName, dataInizio, players) {
  const body = {
    to: toEmail,
    subject: `⏱️ Promemoria torneo ${torneoName}`,
    text: `Ciao! Il tuo torneo inizia il ${dataInizio}.\n
Giocherai con: ${players[0]} & ${players[1]} contro ${players[2]} & ${players[3]}.`
  };

  // endpoint custom su Supabase Function / API esterna
  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  });

  return res.ok;
}
