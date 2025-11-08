// src/components/DashboardVetrina.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import itLocale from "@fullcalendar/core/locales/it";

export default function DashboardVetrina({ user, profile, isAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("home"); // home | prenota | eventi | market | profilo
  const [editing, setEditing] = useState(false);
  const [vetrina, setVetrina] = useState({
    title: "Benvenuti al Centro Padel",
    subtitle: "Prenota i campi, partecipa ai tornei e scopri il marketplace.",
    logoUrl: "/logo.png",
  });

  // bookings state for calendar (simple)
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // fetch initial courts & bookings (public)
    const fetchData = async () => {
      try {
        const { data: courtsData } = await supabase.from("courts").select("*");
        setCourts(courtsData || []);
        const { data: bookingsData } = await supabase.from("bookings").select("*");
        setBookings(bookingsData || []);
      } catch (err) {
        console.error("Errore fetching vetrina data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // edit handlers (local only — you can wire to DB later)
  const handleChangeVetrina = (patch) => setVetrina((s) => ({ ...s, ...patch }));
  const saveVetrinaToDb = async () => {
    // placeholder: you can store vetrina in a settings table
    setEditing(false);
    alert("Contenuto vetrina salvato (da collegare a DB se vuoi).");
  };

  // calendar events mapping
  const events = bookings.map((b) => ({
    id: b.id,
    title: `Campo ${b.court_id}`,
    start: b.start_time,
    end: b.end_time,
    color: b.user_id ? "red" : "green",
  }));

  // booking click for quick demo: if user clicks free slot, create booking (simple demo)
  const handleDateClick = async (info) => {
    if (!isAdmin) {
      alert("Solo l'amministratore può prenotare direttamente dal calendario.");
      return;
    }

    // check if slot already booked on that timestamp
    const exists = bookings.some((b) => new Date(b.start_time).getTime() === info.date.getTime());
    if (exists) {
      alert("Slot già prenotato");
      return;
    }

    // choose first court for demo
    const courtId = courts[0]?.id;
    if (!courtId) {
      alert("Nessun campo disponibile");
      return;
    }

    try {
      const start = info.date.toISOString();
      const end = new Date(info.date.getTime() + 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase.from("bookings").insert([{
        user_id: user.id,
        court_id: courtId,
        start_time: start,
        end_time: end,
      }]);
      if (error) throw error;
      // refresh local bookings
      setBookings((s) => [...s, ...data]);
      alert("Prenotazione effettuata!");
    } catch (err) {
      console.error("Errore prenotazione:", err);
      alert("Errore prenotazione: " + err.message);
    }
  };

  // logout helper (menu)
  const doLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // menu component
  const Menu = () => (
    <div style={{
      position: "absolute",
      top: 60,
      right: 10,
      width: 220,
      background: "#fff",
      boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
      borderRadius: 8,
      padding: 10,
      zIndex: 40
    }}>
      <button style={menuBtnStyle} onClick={() => { setView("prenota"); setMenuOpen(false); }}>Prenota i Campi</button>
      <button style={menuBtnStyle} onClick={() => { setView("eventi"); setMenuOpen(false); }}>Eventi & Tornei</button>
      <button style={menuBtnStyle} onClick={() => { setView("market"); setMenuOpen(false); }}>Marketplace</button>
      <button style={menuBtnStyle} onClick={() => { setView("profilo"); setMenuOpen(false); }}>Profilo</button>
      <hr />
      <button style={menuBtnStyle} onClick={doLogout}>Logout</button>
    </div>
  );

  const menuBtnStyle = {
    display: "block",
    width: "100%",
    padding: "8px 10px",
    marginBottom: 6,
    textAlign: "left",
    background: "none",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* HEADER */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        background: "#0d6efd",
        color: "#fff"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={vetrina.logoUrl} alt="logo" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />
          <div>
            <div style={{ fontWeight: 700 }}>{vetrina.title}</div>
            <div style={{ fontSize: 12 }}>{vetrina.subtitle}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isAdmin && (
            <button
              onClick={() => setEditing((s) => !s)}
              style={{ padding: "8px 10px", borderRadius: 6, border: "none", cursor: "pointer" }}
            >
              {editing ? "Annulla" : "Modifica vetrina"}
            </button>
          )}

          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Apri menu"
            style={{
              width: 44, height: 44, borderRadius: 999, background: "#fff", border: "none", cursor: "pointer"
            }}
          >
            ☰
          </button>
        </div>
      </header>

      {/* menu */}
      {menuOpen && <Menu />}

      <main style={{ padding: 20 }}>
        {/* EDIT MODE (admin) */}
        {editing ? (
          <div style={{ maxWidth: 800, margin: "20px auto", background: "#fafafa", padding: 16, borderRadius: 8 }}>
            <h3>Modifica Vetrina</h3>
            <label>Titolo</label>
            <input value={vetrina.title} onChange={(e) => handleChangeVetrina({ title: e.target.value })} style={{ width: "100%", padding: 8, margin: "6px 0 12px" }} />
            <label>Sottotitolo</label>
            <input value={vetrina.subtitle} onChange={(e) => handleChangeVetrina({ subtitle: e.target.value })} style={{ width: "100%", padding: 8, margin: "6px 0 12px" }} />
            <label>URL Logo</label>
            <input value={vetrina.logoUrl} onChange={(e) => handleChangeVetrina({ logoUrl: e.target.value })} style={{ width: "100%", padding: 8, margin: "6px 0 12px" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveVetrinaToDb} style={{ padding: "8px 12px" }}>Salva</button>
              <button onClick={() => setEditing(false)} style={{ padding: "8px 12px" }}>Annulla</button>
            </div>
          </div>
        ) : null}

        {/* VETRINA / CONTENUTI */}
        {view === "home" && (
          <section style={{ maxWidth: 1100, margin: "20px auto" }}>
            <h2>Vetrina</h2>
            <p>{vetrina.subtitle}</p>

            <h3>Campi disponibili</h3>
            {loadingData ? <p>Caricamento campi...</p> : (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {courts.map((c) => (
                  <div key={c.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, minWidth: 140 }}>
                    <strong>{c.name}</strong>
                  </div>
                ))}
                {courts.length === 0 && <p>Nessun campo disponibile</p>}
              </div>
            )}
          </section>
        )}

        {/* PRENOTA: mostra calendario con eventi */}
        {view === "prenota" && (
          <section style={{ maxWidth: 1100, margin: "20px auto" }}>
            <h2>Prenota i Campi</h2>
            <p>Seleziona uno slot verde per prenotare (clic su data/ora).</p>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              locale={itLocale}
              events={events}
              dateClick={handleDateClick}
              height="auto"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek,timeGridDay",
              }}
            />
          </section>
        )}

        {view === "eventi" && (
          <section style={{ maxWidth: 1100, margin: "20px auto" }}>
            <h2>Eventi & Tornei</h2>
            <p>Qui verranno mostrati gli eventi e tornei creati dall'amministratore.</p>
          </section>
        )}

        {view === "market" && (
          <section style={{ maxWidth: 1100, margin: "20px auto" }}>
            <h2>Marketplace</h2>
            <p>Prodotti e servizi in vendita.</p>
          </section>
        )}

        {view === "profilo" && (
          <section style={{ maxWidth: 800, margin: "20px auto" }}>
            <h2>Profilo</h2>
            <p>Email: {user.email}</p>
            <p>Nome: {profile?.full_name || "-"}</p>
            <p>ID: {user.id}</p>
          </section>
        )}
      </main>
    </div>
  );
}
