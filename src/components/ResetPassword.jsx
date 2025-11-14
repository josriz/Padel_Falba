import React, { useState } from 'react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Qui potresti chiamare l'API di reset di Supabase o altro provider
    // Simulazione di invio email reset
    setTimeout(() => {
      setLoading(false);
      setMessage('Se l’email è registrata, riceverai un link per il reset password.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {message && 
          <p className="mb-6 p-3 text-center rounded bg-green-100 text-green-700 border border-green-400">
            {message}
          </p>
        }

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
              Inserisci la tua email
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="email@example.com"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Invio in corso...' : 'Invia link di reset'}
          </button>
        </form>
      </div>
    </div>
  );
}
