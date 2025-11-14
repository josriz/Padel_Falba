// src/components/AuthComponent.jsx (web version)
const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: '' } } });
if (error) throw error;
alert('Registrazione avvenuta, controlla la tua email.');
} catch (e) { alert('Errore registrazione: ' + e.message); }
finally { setLoading(false); }
}


async function handleResetPassword() {
if (!email) return alert('Inserisci l\'email');
setLoading(true);
try {
const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
if (error) throw error;
alert('Email inviata per reset password');
} catch (e) { alert('Errore: ' + e.message); }
finally { setLoading(false); }
}


return (
<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: 20 }}>
<div style={{ width: 420, background: '#1e293b', padding: 28, borderRadius: 16, color: '#fff' }}>
<img src="/src/assets/logo.png" alt="Logo" style={{ width: 120, height: 60, objectFit: 'contain', display: 'block', margin: '0 auto 12px' }} />
<h2 style={{ textAlign: 'center', marginBottom: 6 }}>Accedi a Cieffe Padel</h2>
<p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: 18 }}>Usa email & password o continua con Google / Facebook</p>


{(mode !== 'reset') && (
<>
<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 10, marginBottom: 10 }} />
<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 10, marginBottom: 10 }} />


<button onClick={handleSignIn} disabled={loading || !email || !password} style={{ width: '100%', padding: 12, background: '#10b981', color: '#fff', borderRadius: 10, border: 'none', fontWeight: 700 }}>
{loading ? 'Caricamento...' : 'Accedi'}
</button>
</>
)}


{mode === 'register' && (
<button onClick={handleSignUp} disabled={loading || !email || !password} style={{ width: '100%', padding: 12, marginTop: 10, background: '#2563eb', color: '#fff', borderRadius: 10 }}>
Registrati
</button>
)}


{mode === 'reset' && (
<>
<p style={{ color: '#d1fae5' }}>Inserisci l'email per ricevere il link di reset</p>
<button onClick={handleResetPassword} disabled={loading || !email} style={{ width: '100%', padding: 12, background: '#f59e0b', color: '#fff', borderRadius: 10 }}>
Invia email reset
</button>
</>
)}


<div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
<button onClick={() => setMode('login')} style={{ background: 'none', color: '#93c5fd', border: 'none' }}>Login</button>
<button onClick={() => setMode('register')} style={{ background: 'none', color: '#93c5fd', border: 'none' }}>Registrati</button>
<button onClick={() => setMode('reset')} style={{ background: 'none', color: '#93c5fd', border: 'none' }}>Reset Password</button>
</div>


<p style={{ color: '#94a3b8', fontSize: 12, marginTop: 16 }}>Usando il servizio accetti la Privacy Policy.</p>
</div>
</div>
);
}