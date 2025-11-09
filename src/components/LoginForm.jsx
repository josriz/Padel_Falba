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
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        alert(
          "Registrazione completata! Controlla la tua email per confermare l'account."
        );
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        onLogin(data.session);
      }
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
    <div
      className="login-container"
      style={{
        width: "100%",
        margin: "0 auto",
        padding: "40px 5vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
        boxSizing: "border-box",
      }}
    >
      <div
        className="login-logo"
        style={{
          textAlign: "center",
          marginBottom: 25,
        }}
      >
        <img
          src="/logo.png"
          alt="Logo Cieffe Padel"
          style={{
            width: "60vw",
            maxWidth: 300,
            height: "auto",
            marginBottom: 8,
          }}
        />
        <h2
          style={{
            margin: 0,
            fontSize: "1.8rem",
            textAlign: "center",
          }}
        >
          {isSignUp ? "Registrati a Cieffe Padel Club" : "Accedi a Cieffe Padel Club"}
        </h2>
        <p
          style={{
            fontStyle: "italic",
            margin: "6px 0 0 0",
            color: "#666",
            fontSize: "1rem",
          }}
        >
          by Claudio Falba
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxWidth: 500,
        }}
      >
        {["email", "password"].map((field) => (
          <input
            key={field}
            type={field}
            placeholder={field === "email" ? "Email" : "Password"}
            value={field === "email" ? email : password}
            onChange={(e) =>
              field === "email"
                ? setEmail(e.target.value)
                : setPassword(e.target.value)
            }
            required
            disabled={loading}
            aria-label={field}
            style={{
              padding: 15,
              fontSize: "1.1rem",
              borderRadius: 10,
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box",
              height: 55,
            }}
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: 55,
            borderRadius: 10,
            border: "none",
            backgroundColor: "#2980b9",
            color: "white",
            fontWeight: "700",
            fontSize: "1.1rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? "Caricamento..."
            : isSignUp
            ? "Registrati"
            : "Accedi"}
        </button>
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "25px 0",
          fontWeight: "bold",
          color: "#2980b9",
          width: "80%",
          maxWidth: 500,
        }}
      >
        <hr style={{ flexGrow: 1, borderColor: "#2980b9" }} />
        <span style={{ margin: "0 10px" }}>o</span>
        <hr style={{ flexGrow: 1, borderColor: "#2980b9" }} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
          maxWidth: 500,
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
            height: 55,
            borderRadius: 10,
            border: "1px solid #ddd",
            backgroundColor: "#fff",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          <FcGoogle size={24} />
          {isSignUp ? "Registrati con Google" : "Accedi con Google"}
        </button>

        <button
          onClick={() => handleOAuthLogin("facebook")}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            height: 55,
            borderRadius: 10,
            border: "1px solid #3b5998",
            backgroundColor: "#3b5998",
            color: "white",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          <FaFacebook size={24} />
          {isSignUp ? "Registrati con Facebook" : "Accedi con Facebook"}
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 15,
          marginTop: 20,
        }}
      >
        <a
          href="#"
          style={{ color: "#2980b9", marginRight: 8 }}
          onClick={async (e) => {
            e.preventDefault();
            if (!email) {
              alert("Inserisci la tua email nel campo sopra per ricevere il link di reset.");
              return;
            }
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: "http://localhost:5173/reset-password", // Modifica con la tua pagina reale
            });
            if (error) {
              alert("Errore invio email: " + error.message);
            } else {
              alert("📩 Email inviata! Controlla la tua casella di posta.");
            }
          }}
        >
          Reset Password
        </a>
        |
        <a
          href="#"
          style={{ color: "#2980b9", marginLeft: 8 }}
          onClick={(e) => {
            e.preventDefault();
            setIsSignUp(!isSignUp);
            setError("");
          }}
        >
          {isSignUp ? "Torna al login" : "Registrati"}
        </a>
      </div>

      <div
        style={{
          fontSize: 13,
          color: "#666",
          textAlign: "center",
          marginTop: 14,
        }}
      >
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#666",
            textDecoration: "underline",
          }}
        >
          Privacy & Policy
        </a>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: 15, textAlign: "center" }}>{error}</p>
      )}

      <footer
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#999",
          marginTop: 30,
        }}
      >
        © 2025 Josè Rizzi
      </footer>
    </div>
  );
}
