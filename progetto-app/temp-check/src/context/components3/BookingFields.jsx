import React from "react";

export default function BookingFields() {
  return (
    <div>
      <label>Seleziona campo:</label>
      <input type="text" placeholder="Campo 1" />
      <label>Data:</label>
      <input type="date" />
      <button>Prenota</button>
    </div>
  );
}
