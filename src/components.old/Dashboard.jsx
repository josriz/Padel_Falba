import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import MenuSidebar from "./MenuSidebar"; 
import Tournament from "./Tournament"; 
import BackButton from "./BackButton"; 

export default function Dashboard({ user }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("home");
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    if (user) setIsAdmin(user.user_metadata?.is_admin || false);
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true });
    if (!error) setEvents(data);
  };

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const renderContent = () => {
    if (view === "tournament" && selectedEventId) return <><BackButton onClick={() => setView("home")} /><Tournament eventId={selectedEventId} user={user} /></>;
    if (view === "profile") return <div>Profilo utente</div>;
    if (view === "bookings") return <div>Prenotazioni campi</div>;
    if (view === "marketplace") return <div>Marketplace</div>;
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Benvenuto {user.email}</h2>
        {isAdmin && <button onClick={() => setView("admin")}>Pannello Amministratore</button>}
        {!isAdmin && <button onClick={openMenu} style={{ position: "absolute", top: 20, right: 20 }}>☰</button>}
        <p>Seleziona un evento dal menu per vedere il tabellone</p>
      </div>
    );
  };

  return (
    <>
      <MenuSidebar
        isOpen={menuOpen}
        onClose={closeMenu}
        items={[
          { label: "Prenota i campi", onClick: () => { setView("bookings"); closeMenu(); } },
          { label: "Marketplace", onClick: () => { setView("marketplace"); closeMenu(); } },
          { label: "Profilo", onClick: () => { setView("profile"); closeMenu(); } },
          { label: "Logout", onClick: async () => { await supabase.auth.signOut(); window.location.reload(); } },
        ]}
        events={events}
        onSelectEvent={(id) => { setSelectedEventId(id); setView("tournament"); }}
      />
      <div style={{ padding: 20 }}>{renderContent()}</div>
    </>
  );
}
