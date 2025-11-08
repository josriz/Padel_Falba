import React from "react";

const Marketplace = () => {
  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "800px",
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: "15px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#007bff",
          marginBottom: "25px",
          fontWeight: "700",
        }}
      >
        🛍️ Marketplace Cieffe Padel
      </h2>

      {/* Primo prodotto */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          borderLeft: "6px solid #007bff",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <img
          src="https://cdn.pixabay.com/photo/2019/09/29/16/08/padel-4512902_960_720.jpg"
          alt="Racchetta"
          style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
        />
        <div>
          <h3 style={{ color: "#333", marginBottom: "5px" }}>
            🎾 Racchetta Bullpadel Vertex 04
          </h3>
          <p style={{ color: "#555", marginBottom: "5px" }}>🔥 Sconto 20% solo per soci</p>
          <p style={{ color: "#666" }}>
            Potenza e controllo in un’unica racchetta.  
            <strong>Prezzo: 199€</strong>
          </p>
        </div>
      </div>

      {/* Secondo prodotto */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          borderLeft: "6px solid #28a745",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <img
          src="https://cdn.pixabay.com/photo/2017/06/05/13/12/shoes-2374540_960_720.jpg"
          alt="Scarpe padel"
          style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
        />
        <div>
          <h3 style={{ color: "#333", marginBottom: "5px" }}>👟 Scarpe Padel Nike Court Zoom</h3>
          <p style={{ color: "#555", marginBottom: "5px" }}>Comfort e stabilità</p>
          <p style={{ color: "#666" }}>
            Ideali per superfici indoor e outdoor.  
            <strong>Prezzo: 129€</strong>
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 25px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "0.3s",
          }}
          onClick={() => window.history.back()}
        >
          ⬅ Torna indietro
        </button>
      </div>
    </div>
  );
};

export default Marketplace;
