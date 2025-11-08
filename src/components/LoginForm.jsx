import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import "./LoginForm.css";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onLogin(data.user);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    setLoading(false);
    if (error) setError(error.message);
  };

  return (
    <div className="login-container" style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <div
        className="login-logo"
        style={{
          textAlign: "center",
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo Cieffe Padel"
          style={{ maxWidth: 180, marginBottom: 2 }}
        />
        <p
          style={{
            fontStyle: "italic",
            margin: "0 0 4px 0",
            color: "#666",
            fontSize: "0.9rem",
          }}
        >
          by Claudio Falba
        </p>
        <h2 style={{ margin: 0 }}>Accedi a Cieffe Padel Club</h2>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          aria-label="Email"
          style={{ padding: 12, fontSize: "1rem", width: "100%", marginBottom: 12 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          aria-label="Password"
          style={{ padding: 12, fontSize: "1rem", width: "100%", marginBottom: 12 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 8,
            border: "none",
            backgroundColor: "#2980b9",
            color: "white",
            fontWeight: "700",
            fontSize: "1.1rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Caricamento..." : "Accedi"}
        </button>
      </form>

      <div
        className="divider"
        style={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0",
          fontWeight: "bold",
          color: "#2980b9",
        }}
      >
        <hr style={{ flexGrow: 1, borderColor: "#2980b9" }} />
        <span style={{ margin: "0 10px" }}>o</span>
        <hr style={{ flexGrow: 1, borderColor: "#2980b9" }} />
      </div>

      <div
        className="social-login"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: 14,
            borderRadius: 8,
            border: "1px solid #ddd",
            backgroundColor: "#fff",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <FcGoogle size={24} />
          Accedi con Google
        </button>

        <button
          onClick={() => handleOAuthLogin("facebook")}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: 14,
            borderRadius: 8,
            border: "1px solid #3b5998",
            backgroundColor: "#3b5998",
            color: "white",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <FaFacebook size={24} />
          Accedi con Facebook
        </button>
      </div>

      <div
        className="login-links"
        style={{ textAlign: "center", fontSize: 14, marginBottom: 12 }}
      >
        <a href="#" style={{ marginRight: 10, color: "#2980b9" }}>
          Reset Password
        </a>
        |
        <a href="#" style={{ marginLeft: 10, color: "#2980b9" }}>
          Registrati
        </a>
      </div>

      <div
        className="login-privacy"
        style={{ fontSize: 12, color: "#666", textAlign: "center" }}
      >
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#666", textDecoration: "underline" }}
        >
          Privacy & Policy
        </a>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: 10, textAlign: "center" }}>{error}</p>
      )}
    </div>
  );
}
