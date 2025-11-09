import React from "react";

export default function Dashboard({ user, onLogout, isAdmin }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        padding: "40px 5vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "1.8rem",
          textAlign: "center",
          marginBottom: 10,
          color: "#333",
        }}
      >
        Benvenuto, {user.email}
      </h1>

      <p
        style={{
          fontSize: "1.1rem",
          textAlign: "center",
          color: "#555",
          marginBottom: 20,
        }}
      >
        Questa è la tua dashboard di vetrina.
      </p>

      {isAdmin && (
        <p
          style={{
            fontWeight: "bold",
            color: "green",
            fontSize: "1rem",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Puoi variare e modificare i dati come amministratore.
        </p>
      )}

      <div
        style={{
          marginTop: 30,
          width: "100%",
          maxWidth: 500,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            maxWidth: 200,
            height: 55,
            borderRadius: 10,
            border: "none",
            backgroundColor: "#f44336",
            color: "#fff",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
