import React from "react";

export default function MenuSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Sfondo scuro */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1000,
          }}
        ></div>
      )}

      {/* MENU */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-260px",
          width: "260px",
          height: "100vh",
          background: "white",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
          zIndex: 1100,
          padding: "20px",
          transition: "right 0.3s ease-in-out",
        }}
      >
        <h3>Menu</h3>
        <ul>
          <li>Profilo</li>
          <li>Prenotazioni</li>
          <li>Logout</li>
        </ul>
      </div>
    </>
  );
}
