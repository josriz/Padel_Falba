import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import logo from "../assets/logo.png";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onLogin(data.user);
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleFacebook = async () => {
    await supabase.auth.signInWithOAuth({ provider: "facebook" });
  };

  const handleReset = async () => {
    if (!email) return alert("Inserisci la tua email per il reset.");
    await supabase.auth.resetPasswordForEmail(email);
    alert("Email per il reset inviata!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 text-center">
        <img src={logo} alt="Logo" className="mx-auto w-24 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Accedi a Cieffe Club</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded-lg font-semibold mb-3"
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <div className="flex flex-col gap-2 mt-2">
          <button onClick={handleGoogle} className="bg-red-500 text-white py-2 rounded-lg">
            Accedi con Google
          </button>
          <button onClick={handleFacebook} className="bg-blue-700 text-white py-2 rounded-lg">
            Accedi con Facebook
          </button>
          <button onClick={handleReset} className="text-sm text-gray-600 mt-2">
            Hai dimenticato la password?
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">Registrandoti accetti la nostra Privacy Policy</p>
      </div>
    </div>
  );
}
