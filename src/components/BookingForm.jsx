import { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function BookingForm() {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'error' | 'success'

  const userId = "0ddd5775-5146-45c6-a4dd-858c0f742d24"; // utente test
  const hours = [14, 15, 16, 17, 18, 19]; // fasce orarie
  const today = new Date();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: courtsData, error: courtsError } = await supabase.from("courts").select("*");
      const { data: bookingsData, error: bookingsError } = await supabase.from("bookings").select("*");
      if (courtsError || bookingsError) {
        setMessage({ text: "Errore nel caricamento dati.", type: "error" });
      } else {
        setCourts(courtsData || []);
        setBookings(bookingsData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCourt) {
      const bookedHours = bookings
        .filter(
          (b) =>
            b.court_id === parseInt(selectedCourt) &&
            new Date(b.start_time).getDate() === today.getDate()
        )
        .map((b) => new Date(b.start_time).getHours());

      const freeHours = hours.filter((h) => !bookedHours.includes(h));
      setAvailableHours(freeHours);
      setSelectedHour(""); // reset selected hour when court changes
    } else {
      setAvailableHours([]);
      setSelectedHour("");
    }
  }, [selectedCourt, bookings]);

  const handleBooking = async () => {
    if (!selectedCourt) {
      setMessage({ text: "Seleziona un campo.", type: "error" });
      return;
    }
    if (!selectedHour) {
      setMessage({ text: "Seleziona una fascia oraria disponibile.", type: "error" });
      return;
    }

    setLoading(true);
    const hour = parseInt(selectedHour);
    const start_time = new Date(today);
    start_time.setHours(hour, 0, 0, 0);
    const end_time = new Date(today);
    end_time.setHours(hour + 1, 0, 0, 0);

    const { error } = await supabase.from("bookings").insert([
      {
        court_id: parseInt(selectedCourt),
        user_id: userId,
        start_time,
        end_time,
        status: "confirmed",
      },
    ]);

    if (!error) {
      setMessage({
        text: `Prenotazione confermata per Campo ${selectedCourt} alle ${hour}:00.`,
        type: "success",
      });
      setSelectedCourt("");
      setSelectedHour("");
      // Aggiorna localmente la lista prenotazioni per riflettere subito il cambiamento
      setBookings([
        ...bookings,
        {
          court_id: parseInt(selectedCourt),
          start_time,
          end_time,
          user_id: userId,
          status: "confirmed",
          id: Date.now(),
        },
      ]);
    } else {
      setMessage({ text: "Errore durante la prenotazione: " + error.message, type: "error" });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "20px auto",
        padding: 20,
        borderRadius: 16,
        backgroundColor: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#2c3e50",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20, color: "#2980b9", fontWeight: 900 }}>
        Prenota il Campo
      </h2>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontWeight: "700", marginBottom: 6 }}>Seleziona Campo:</label>
        <select
          value={selectedCourt}
          onChange={(e) => setSelectedCourt(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1.5px solid #2980b9",
            fontSize: "1rem",
            color: selectedCourt ? "#2c3e50" : "#999",
            cursor: "pointer",
          }}
        >
          <option value="">-- Scegli Campo --</option>
          {courts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCourt && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: "700", marginBottom: 6 }}>Ore disponibili:</label>
          <select
            value={selectedHour}
            onChange={(e) => setSelectedHour(e.target.value)}
            disabled={loading || availableHours.length === 0}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1.5px solid #2980b9",
              fontSize: "1rem",
              color: selectedHour ? "#2c3e50" : "#999",
              cursor: availableHours.length > 0 ? "pointer" : "not-allowed",
            }}
          >
            {availableHours.length > 0 ? (
              availableHours.map((h) => (
                <option key={h} value={h}>
                  {h}:00 - {h + 1}:00
                </option>
              ))
            ) : (
              <option>Nessuna ora disponibile</option>
            )}
          </select>
        </div>
      )}

      {message.text && (
        <div
          role="alert"
          style={{
            marginBottom: 16,
            padding: "10px",
            borderRadius: 10,
            color: message.type === "error" ? "#c0392b" : "#27ae60",
            backgroundColor: message.type === "error" ? "#fdecea" : "#eafaf1",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={loading || !selectedCourt || !selectedHour}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 14,
          backgroundColor: loading ? "#95c0e9" : "#2980b9",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.1rem",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#1c6690")}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#2980b9")}
      >
        {loading ? "Caricamento..." : "Prenota"}
      </button>
    </div>
  );
}
