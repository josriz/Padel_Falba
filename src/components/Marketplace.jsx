import React from "react";

const Marketplace = () => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        padding: "40px 5vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f7f8fa",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#007bff",
          marginBottom: 30,
          fontWeight: "700",
          fontSize: "1.8rem",
        }}
      >
        🛍️ Marketplace Cieffe Padel
      </h2>

      {/* Primo prodotto */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderLeft: "6px solid #007bff",
          display: "flex",
          alignItems: "center",
          gap: 15,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <img
          src="https://cdn.pixabay.com/photo/2019/09/29/16/08/padel-4512902_960_720.jpg"
          alt="Racchetta"
          style={{ width: 100, height: 100, borderRadius: 10, objectFit: "cover" }}
        />
        <div>
          <h3 style={{ color: "#333", marginBottom: 5 }}>
            🎾 Racchetta Bullpadel Vertex 04
          </h3>
          <p style={{ color: "#555", marginBottom: 5 }}>🔥 Sconto 20% solo per soci</p>
          <p style={{ color: "#666", marginBottom: 0 }}>
            Potenza e controllo in un’unica racchetta. <strong>Prezzo: 199€</strong>
          </p>
        </div>
      </div>

      {/* Secondo prodotto */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderLeft: "6px solid #28a745",
          display: "flex",
          alignItems: "center",
          gap: 15,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <img
          src="https://cdn.pixabay.com/photo/2017/06/05/13/12/shoes-2374540_960_720.jpg"
          alt="Scarpe padel"
          style={{ width: 100, height: 100, borderRadius: 10, objectFit: "cover" }}
        />
        <div>
          <h3 style={{ color: "#333", marginBottom: 5 }}>👟 Scarpe Padel Nike Court Zoom</h3>
          <p style={{ color: "#555", marginBottom: 5 }}>Comfort e stabilità</p>
          <p style={{ color: "#666", marginBottom: 0 }}>
            Ideali per superfici indoor e outdoor. <strong>Prezzo: 129€</strong>
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 30, width: "100%", maxWidth: 500 }}>
        <button
          style={{
            width: "100%",
            height: 55, // stessa altezza bottoni principali
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: "600",
            transition: "0.3s",
          }}
          onClick={() => window.history.back()}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          ⬅ Torna indietro
        </button>
      </div>
    </div>
  );
};

export default Marketplace;
