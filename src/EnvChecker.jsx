export default function EnvChecker({ children }) {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return (
      <div style={{ padding: 20, backgroundColor: '#fee', color: '#900', fontWeight: 'bold' }}>
        ERRORE: Variabili d&apos;ambiente Supabase mancanti o non caricate correttamente.
        <br />
        Controlla il file <code>.env</code> e riavvia il server di sviluppo.
      </div>
    );
  }
  return children;
}
