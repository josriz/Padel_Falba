import React, { useState } from "react";

export default function AdminDashboard() {
  const [editing, setEditing] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [newsText, setNewsText] = useState("");

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBackgroundImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleNewsChange = (e) => setNewsText(e.target.value);

  const handleNewsSubmit = () => {
    alert("News salvata: " + newsText);
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>Dashboard Amministratore - Gestione Contenuti</h1>

      <button
        onClick={() => setEditing(!editing)}
        style={{
          padding: "10px 20px",
          backgroundColor: editing ? "#4caf50" : "#2196f3",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        {editing ? "Disabilita modalità Modifica" : "Abilita modalità Modifica"}
      </button>

      <section style={{ marginBottom: 30 }}>
        <h2>Imposta foto di sfondo trasparente</h2>
        {editing && (
          <input type="file" accept="image/*" onChange={handleBackgroundChange} />
        )}
        {backgroundImage && (
          <div
            style={{
              marginTop: 10,
              width: "100%",
              height: 200,
              backgroundImage: `url(${backgroundImage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
              opacity: 0.5,
              border: "1px solid #ccc",
              borderRadius: 8,
            }}
          />
        )}
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>Scrivi e Gestisci News</h2>
        {editing ? (
          <>
            <textarea
              value={newsText}
              onChange={handleNewsChange}
              rows={5}
              style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 5, borderColor: "#ccc" }}
              placeholder="Scrivi qui la news..."
            />
            <button
              onClick={handleNewsSubmit}
              style={{
                marginTop: 10,
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Salva News
            </button>
          </>
        ) : (
          <p>Per modificare, abilita la modalità Modifica.</p>
        )}
      </section>
    </div>
  );
}
