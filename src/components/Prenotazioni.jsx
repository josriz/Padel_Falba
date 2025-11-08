import React, { useState } from "react";
import BackButton from "./BackButton";

const COURTS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Campo ${i + 1}`,
  description: `Campo numero ${i + 1}, superficie sintetica`,
}));

const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
];

const initialBookings = [
  { id: 1, courtId: 1, date: "2025-11-10", timeSlot: "10:00 - 11:00", user: "Mario" },
  { id: 2, courtId: 3, date: "2025-11-10", timeSlot: "17:00 - 18:00", user: "Luigi" },
];

export default function Prenotazioni() {
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  const isCourtAvailable = (courtId, date, timeSlot) => {
    return !bookings.some(
      (b) => b.courtId === courtId && b.date === date && b.timeSlot === timeSlot
    );
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedCourt || !selectedTimeSlot) {
      setMessage("Seleziona data, campo e fascia oraria");
      return;
    }
    if (!isCourtAvailable(selectedCourt, selectedDate, selectedTimeSlot)) {
      setMessage("Campo non disponibile per la data e orario selezionati");
      return;
    }
    const newBooking = {
      id: bookings.length + 1,
      courtId: selectedCourt,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      user: "UtenteDemo",
    };
    setBookings([...bookings, newBooking]);
    setMessage("Prenotazione effettuata con successo!");
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial, sans-serif", padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <BackButton />
      <h2 style={{ color: "#007bff", textAlign: "center", marginBottom: 25 }}>Prenotazioni Campi Padel</h2>

      <label style={{ display: "block", marginBottom: 15 }}>
        Data:
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 6 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 15 }}>
        Campo:
        <select
          disabled={!selectedDate}
          value={selectedCourt ?? ""}
          onChange={(e) => setSelectedCourt(Number(e.target.value))}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 6 }}
        >
          <option value="" disabled>Seleziona campo</option>
          {COURTS.map((court) => {
            const occupied = selectedDate ? TIME_SLOTS.some(ts => !isCourtAvailable(court.id, selectedDate, ts)) : false;
            return (
              <option key={court.id} value={court.id} title={court.description} style={{ color: occupied ? "#a00" : "inherit" }}>
                {court.name} {occupied ? "(parzialmente occupato)" : ""}
              </option>
            );
          })}
        </select>
      </label>

      <label style={{ display: "block", marginBottom: 15 }}>
        Fascia Oraria:
        <select
          disabled={!selectedCourt}
          value={selectedTimeSlot}
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 6 }}
        >
          <option value="" disabled>Seleziona orario</option>
          {TIME_SLOTS.map((slot) => (
            <option
              key={slot}
              value={slot}
              disabled={!isCourtAvailable(selectedCourt, selectedDate, slot)}
              title={!isCourtAvailable(selectedCourt, selectedDate, slot) ? "Occupato" : "Disponibile"}
              style={{ color: !isCourtAvailable(selectedCourt, selectedDate, slot) ? "#a00" : "inherit" }}
            >
              {slot} {!isCourtAvailable(selectedCourt, selectedDate, slot) ? "(Occupato)" : ""}
            </option>
          ))}
        </select>
      </label>

      <button
        disabled={!selectedDate || !selectedCourt || !selectedTimeSlot}
        onClick={handleBooking}
        style={{ width: "100%", padding: 12, backgroundColor: "#007bff", color: "white", borderRadius: 8, border: "none", fontWeight: "600", cursor: "pointer" }}
      >
        Prenota Campo
      </button>

      {message && (
        <p style={{ marginTop: 16, fontWeight: "600", color: message.includes("successo") ? "green" : "red" }}>
          {message}
        </p>
      )}

      <section style={{ marginTop: 30 }}>
        <h3>Prenotazioni Attive</h3>
        {bookings.length === 0 ? (
          <p>Nessuna prenotazione per ora.</p>
        ) : (
          <ul>
            {bookings.map((b) => (
              <li key={b.id}>
                Campo: {COURTS.find((c) => c.id === b.courtId)?.name || "Campo sconosciuto"}, Data: {b.date}, Orario: {b.timeSlot}, Prenotato da: {b.user}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
