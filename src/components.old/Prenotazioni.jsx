// src/components/Prenotazioni.jsx
import React, { useState, useEffect } from "react";
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

const uniformStyle = {
  width: "100%",
  height: 55,
  padding: "0 14px",
  fontSize: "1.1rem",
  borderRadius: 10,
  border: "1.5px solid #88aaff",
  boxShadow: "inset 0 0 8px #bbd7ff",
  cursor: "pointer",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.3s, box-shadow 0.3s",
};

const uniformFocusStyle = {
  borderColor: "#4a90e2",
  boxShadow: "inset 0 0 12px #88aaff",
};

export default function Prenotazioni() {
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!selectedDate) {
      setSelectedCourt(null);
      setSelectedTimeSlot("");
    }
  }, [selectedDate]);

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
      <BackButton />

      <h2
        style={{
          color: "#3366cc",
          textAlign: "center",
          marginBottom: 30,
          fontSize: "1.8rem",
        }}
      >
        Prenotazioni Campi Padel
      </h2>

      <div
        style={{
          width: "100%",
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Data */}
        <label style={{ display: "flex", flexDirection: "column", fontSize: "1rem" }}>
          Data:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            style={uniformStyle}
            onFocus={(e) => Object.assign(e.target.style, uniformFocusStyle)}
            onBlur={(e) =>
              Object.assign(e.target.style, {
                borderColor: "#88aaff",
                boxShadow: "inset 0 0 8px #bbd7ff",
              })
            }
            aria-label="Seleziona la data"
          />
        </label>

        {/* Campo */}
        <label style={{ display: "flex", flexDirection: "column", fontSize: "1rem" }}>
          Campo:
          <select
            disabled={!selectedDate}
            value={selectedCourt ?? ""}
            onChange={(e) => setSelectedCourt(Number(e.target.value))}
            style={uniformStyle}
            onFocus={(e) => Object.assign(e.target.style, uniformFocusStyle)}
            onBlur={(e) =>
              Object.assign(e.target.style, {
                borderColor: "#88aaff",
                boxShadow: "inset 0 0 8px #bbd7ff",
              })
            }
            aria-label="Seleziona il campo"
          >
            <option value="" disabled>
              Seleziona campo
            </option>
            {COURTS.map((court) => {
              const occupied = selectedDate
                ? TIME_SLOTS.some((ts) => !isCourtAvailable(court.id, selectedDate, ts))
                : false;
              return (
                <option
                  key={court.id}
                  value={court.id}
                  title={court.description}
                  style={{ color: occupied ? "#a00" : "inherit" }}
                >
                  {court.name} {occupied ? "(parzialmente occupato)" : ""}
                </option>
              );
            })}
          </select>
        </label>

        {/* Fascia Oraria */}
        <label style={{ display: "flex", flexDirection: "column", fontSize: "1rem" }}>
          Fascia Oraria:
          <select
            disabled={!selectedCourt}
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            style={uniformStyle}
            onFocus={(e) => Object.assign(e.target.style, uniformFocusStyle)}
            onBlur={(e) =>
              Object.assign(e.target.style, {
                borderColor: "#88aaff",
                boxShadow: "inset 0 0 8px #bbd7ff",
              })
            }
            aria-label="Seleziona la fascia oraria"
          >
            <option value="" disabled>
              Seleziona orario
            </option>
            {TIME_SLOTS.map((slot) => (
              <option
                key={slot}
                value={slot}
                disabled={!isCourtAvailable(selectedCourt, selectedDate, slot)}
                style={{ color: !isCourtAvailable(selectedCourt, selectedDate, slot) ? "#a00" : "inherit" }}
              >
                {slot} {!isCourtAvailable(selectedCourt, selectedDate, slot) ? "(Occupato)" : ""}
              </option>
            ))}
          </select>
        </label>

        {/* Prenota */}
        <button
          disabled={!selectedDate || !selectedCourt || !selectedTimeSlot}
          onClick={handleBooking}
          style={{
            width: "100%",
            height: 55,
            borderRadius: 10,
            border: "none",
            backgroundColor: "#3366cc",
            color: "white",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(51, 102, 204, 0.6)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#274a8a")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3366cc")}
        >
          Prenota Campo
        </button>

        {message && (
          <p
            style={{
              marginTop: 20,
              fontWeight: "600",
              color: message.includes("successo") ? "green" : "red",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* Prenotazioni per data */}
      {selectedDate && (
        <section
          style={{
            marginTop: 40,
            width: "100%",
            maxWidth: 500,
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginBottom: 15, color: "#3366cc", fontWeight: "600" }}>
            Prenotazioni per il {selectedDate}
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f8ff" }}>
                <th style={{ textAlign: "left", padding: 10, borderBottom: "2px solid #88aaff" }}>
                  Campo
                </th>
                <th style={{ textAlign: "left", padding: 10, borderBottom: "2px solid #88aaff" }}>
                  Orario
                </th>
                <th style={{ textAlign: "left", padding: 10, borderBottom: "2px solid #88aaff" }}>
                  Prenotato da
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter((b) => b.date === selectedDate)
                .map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: 10 }}>{COURTS.find((c) => c.id === b.courtId)?.name || "Sconosciuto"}</td>
                    <td style={{ padding: 10 }}>{b.timeSlot}</td>
                    <td style={{ padding: 10 }}>{b.user}</td>
                  </tr>
                ))}
              {bookings.filter((b) => b.date === selectedDate).length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: 10, textAlign: "center", color: "#999" }}>
                    Nessuna prenotazione per questa data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
