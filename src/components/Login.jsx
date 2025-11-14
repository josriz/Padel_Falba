import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const displayMessage = error.message.includes('Invalid login credentials') 
          ? "Email o password non validi. Riprova." 
          : `Accesso fallito: ${error.message}`;
      setMessage(displayMessage);
    } else {
      setMessage('Accesso effettuato con successo. Reindirizzamento...');
      navigate('/dashboard', { replace: true }); 
    }
    setLoading(false);
  };
  
  const handleSocialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + '/dashboard' },
    });
    if (error) setMessage(`Accesso con ${provider} fallito: ${error.message}`);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-5 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 box-border">
        <div className="text-center mb-6">
          <span className="text-3xl font-bold text-blue-600">PADEL APP</span>
        </div>
        
        <h2 className="text-2xl text-center text-gray-800 mb-6">Accedi</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="La tua email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="********"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bottoni social spostati qui */}
          <div className={`flex flex-col ${window.innerWidth < 500 ? 'space-y-4' : 'space-y-0 space-x-4 flex-row mb-6'}`}>
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex-1 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Accedi con Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="flex-1 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
            >
              Accedi con Facebook
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 p-3 rounded text-center font-semibold ${
              message.startsWith('Accesso fallito') || message.includes('non validi')
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            }`}
          >
            {message}
          </p>
        )}

        <div className={`mt-6 flex ${window.innerWidth < 500 ? 'flex-col space-y-3' : 'justify-between'}`}>
          <Link to="/reset-password" className="text-blue-600 hover:underline text-center">
            Password dimenticata?
          </Link>
          <Link to="/register" className="text-blue-600 hover:underline text-center">
            Registrati
          </Link>
        </div>

        <p className="mt-10 text-xs text-center text-gray-400">
          Continuando, accetti i nostri{' '}
          <a href="/terms" target="_blank" className="underline text-blue-600">
            Termini di Servizio
          </a>{' '}
          e{' '}
          <a href="/privacy" target="_blank" className="underline text-blue-600">
            Politica sulla Privacy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
