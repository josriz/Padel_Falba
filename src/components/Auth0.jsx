// src/components/Auth.jsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { AlertTriangle, Loader, LogIn, UserPlus } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { setUser } = useAuth(); 
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  /**
   * Visualizza un messaggio di stato temporaneo.
   */
  const showMessage = (type, text) => {
    setMessage({ type, text });
    // Pulisce il timeout precedente e ne imposta uno nuovo
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage({ type: null, text: '' }), 7000);
  };

  /**
   * Cleanup del timeout all'unmount del componente.
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /**
   * Gestione del redirect OAuth (dopo il ritorno da Google/Facebook).
   */
  useEffect(() => {
    const url = new URL(window.location.href);
    
    // Verifica se l'URL contiene hash relativi alla sessione (token)
    if (url.hash.includes('access_token')) {
      const handleOAuthRedirect = async () => {
        try {
          // Tenta di recuperare la sessione dal Supabase client
          const { data } = await supabase.auth.getSession();
          
          if (data?.session?.user) {
            setUser(data.session.user);
            showMessage('success', "Accesso con social riuscito!");
            navigate('/dashboard');
            // Pulisce l'URL hash dopo il redirect per evitare loop
            window.history.replaceState({}, document.title, '/auth'); 
          }
        } catch (err) {
          showMessage('error', `Errore OAuth redirect: ${err.message || 'Errore sconosciuto.'}`);
        }
      };
      handleOAuthRedirect();
    }
  }, [navigate, setUser]);

  /**
   * Gestione del login o signup con email/password.
   */
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      let result = {};

      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });

        if (result.error) {
          // Logica di errore per il signup
          let errorMessage = "Errore durante la registrazione.";
          if (result.error.message.includes('User already registered')) {
            errorMessage = "Email già registrata. Prova ad accedere.";
          } else {
            errorMessage = `Errore Supabase: ${result.error.message}`;
          }
          showMessage('error', errorMessage);
        } else if (result.data.user && !result.data.session) {
          // Utente creato, ma sessione non stabilita (richiede conferma email)
          showMessage('warning', "Registrazione quasi completata! Controlla la tua email per la conferma.");
        } else if (result.data.user && result.data.session) {
            // Registrazione riuscita e accesso immediato (solo se la conferma email è disattivata)
            setUser(result.data.user);
            showMessage('success', "Registrazione e Accesso riusciti!");
            navigate('/dashboard');
        }

      } else { // Logica di Sign In
        result = await supabase.auth.signInWithPassword({ email, password });

        if (result.error) {
          // Logica di errore per il login
          let errorMessage = "Errore durante l'accesso.";
          if (result.error.message.includes('Invalid login credentials')) {
            errorMessage = "Credenziali non valide.";
          } else {
            errorMessage = `Errore Supabase: ${result.error.message}`;
          }
          showMessage('error', errorMessage);
        } else if (result.data?.user) {
          // Login riuscito
          setUser(result.data.user);
          showMessage('success', "Accesso riuscito!");
          navigate('/dashboard');
          return;
        }
        // Caso senza errore e senza utente (raro, a meno che non sia legato a problemi di conferma email)
        if (!result.data?.user && !result.error) {
            showMessage('warning', "Accesso non riuscito. Potrebbe essere necessaria la conferma email.");
        }
      }

    } catch (err) {
      showMessage('error', `Errore di connessione: ${err.message || 'Verifica la tua rete.'}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gestione del login con provider OAuth (Google, Facebook, ecc.).
   */
  const handleOAuthLogin = async (provider) => {
    setMessage({ type: null, text: '' });
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { 
          // Torna alla root del sito, poi il useEffect si occuperà della sessione
          redirectTo: window.location.origin + '/auth' 
        },
      });
      if (error) showMessage('error', `Errore accesso con ${provider}: ${error.message}`);
      // Il setLoading(false) in caso di successo NON viene eseguito qui 
      // perché l'utente viene reindirizzato esternamente.
    } catch {
      showMessage('error', `Errore di rete durante l'accesso social.`);
      setLoading(false); // Eseguito solo se fallisce prima del redirect
    }
  };

  /**
   * Alterna tra modalità Login e Registrazione.
   */
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setMessage({ type: null, text: '' });
    setEmail('');
    setPassword('');
  };

  // Controllo base per abilitare il pulsante di submit
  const isInputValid = email.length > 0 && password.length >= 6;
  const SubmitIcon = isSignUp ? UserPlus : LogIn;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-3xl max-w-md w-full shadow-md">
        <div className="flex flex-col items-center mb-1">
          <img src="/logo.png" alt="Logo Padel Club" className="max-w-[120px] mb-2" />
          <p className="italic text-sm text-gray-400 mb-6">by Claudio Falba</p>
          <h1 className="text-3xl font-bold text-indigo-700 mb-1">Accedi a Padel Tracker</h1>
          <p className="text-sm text-gray-500 mb-6">{isSignUp ? 'Crea il tuo Account' : 'Continua con le tue credenziali'}</p>
        </div>

        {/* Messaggio di Stato (Errore/Successo/Warning) */}
        {message.type && (
          <div className={`mb-6 px-4 py-3 rounded text-sm ${
            message.type === 'error' ? 'bg-red-100 text-red-700' :
            message.type === 'success' ? 'bg-green-100 text-green-700' :
            'bg-yellow-100 text-yellow-700'
          } flex items-center`}>
            <AlertTriangle className="w-5 h-5 mr-2" />
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5 mb-6">
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="utente@esempio.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Minimo 6 caratteri"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !isInputValid}
            className={`w-full flex justify-center items-center py-3 rounded-lg font-bold transition ${
              isInputValid && !loading ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {loading ? <Loader className="w-5 h-5 animate-spin mr-3" /> : <SubmitIcon className="w-5 h-5 mr-3" />}
            {loading ? 'Elaborazione...' : (isSignUp ? 'Registra Account' : 'Accedi')}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-400 lowercase">o</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="space-y-4 mb-6">
          <button onClick={() => handleOAuthLogin("google")} disabled={loading} className="flex items-center justify-center w-full py-3 rounded-lg border border-gray-300 hover:bg-indigo-50 transition">
            <FcGoogle size={24} className="mr-3" />
            Accedi con Google
          </button>
          <button onClick={() => handleOAuthLogin("facebook")} disabled={loading} className="flex items-center justify-center w-full py-3 rounded-lg bg-[#3b5998] text-white hover:bg-[#344e86] transition">
            <FaFacebook size={24} className="mr-3" />
            Accedi con Facebook
          </button>
        </div>
        
        <div className="mt-6 text-center border-t border-gray-200 pt-5">
          <button onClick={toggleMode} className="text-indigo-600 hover:underline font-semibold text-sm">
            {isSignUp ? 'Hai già un account? Accedi ora' : 'Non hai un account? Registrati qui'}
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          Privacy &amp; Policy - Tutti i dati vengono trattati nel rispetto della normativa vigente.
        </div>
        <div className="mt-1 text-center italic text-xs text-gray-400">
          ©by Josè Rizzi
        </div>
      </div>
    </div>
  );
};

export default Auth;