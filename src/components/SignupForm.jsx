import { useState } from "react";
import { supabase } from "../supabase";

export default function SignupForm({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  // Signup con email/password
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, // salva il nome completo nel profilo
      },
    });

    if (error) setError(error.message);
    else onSignup(data.user);
  };

  // Signup/Login tramite OAuth
  const handleOAuthSignup = async (provider) => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });

    if (error) setError(error.message);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>

      <p style={{ textAlign: "center", margin: "15px 0" }}>Oppure registra con:</p>
      <button onClick={() => handleOAuthSignup("google")} style={{ marginRight: "10px" }}>
        Google
      </button>
      <button onClick={() => handleOAuthSignup("facebook")}>
        Facebook
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}
