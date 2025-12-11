import React, { useState } from "react";
import { supabase } from "../SupabaseContext";

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Registrazione completata!");
  };

  return (
    <form onSubmit={handleRegister} style={{ marginTop: "2rem" }}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Registrati</button>
    </form>
  );
}
