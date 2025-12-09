import React from "react";
import { useAuth } from "../context/AuthProvider";

export default function EventSignup({ eventId }) {
  const { user } = useAuth();

  if (!user) return <div>Devi fare login per iscriverti all'evento</div>;

  return (
    <div>
      <h2>Iscrizione Evento</h2>
      {/* Form iscrizione evento */}
    </div>
  );
}
