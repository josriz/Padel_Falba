import React from "react";

export default function MenuSidebar({ isOpen, onClose, items, events, onSelectEvent }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "260px",
        height: "100%",
        background: "#1e293b",
        color: "white",
        padding: "20px",
        boxShadow: "-2px 0 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}
    >
      <button onClick={onClose} style={{ float: "right", fontSize: "18px", background: "none", color: "white" }}>
        ✕
      </button>
      <h3 style={{ marginBottom: "20px" }}>Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: "12px" }}>
            <button
              onClick={item.onClick}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <hr style={{ margin: "20px 0", borderColor: "#334155" }} />
      <h4>Eventi</h4>
      {events?.length ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {events.map((ev) => (
            <li key={ev.id} style={{ marginBottom: "8px" }}>
              <button
                onClick={() => onSelectEvent(ev.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#a5f3fc",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                {ev.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#94a3b8" }}>Nessun evento disponibile</p>
      )}
    </div>
  );
}
