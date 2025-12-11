// src/components/Iscrizione.jsx - CORRETTO
async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setMessage({ type: null, text: '' });

  try {
    // ✅ FIX: tournament_id invece di torneo_id
    const { data: existing } = await supabase
      .from('tournament_players')
      .select('email')
      .eq('tournament_id', torneoId)  // ← FIXATO!

    if (existing?.length > 0) {
      throw new Error('Email già iscritta!');
    }

    // ✅ FIX: tournament_id
    const playerData = {
      ...form,
      tournament_id: torneoId,  // ← FIXATO!
      status: 'iscritto'
    };

    const { error } = await supabase.from('tournament_players').insert([playerData]);
    if (error) throw error;

    setMessage({ type: 'success', text: '✅ Iscritto!' });
    setForm({ name: '', surname: '', email: '', phone: '' });
  } catch (err) {
    setMessage({ type: 'error', text: err.message });
  } finally {
    setLoading(false);
  }
}
