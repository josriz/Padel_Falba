import React from "react";
import { useAuth } from "../context/AuthProvider";
import BookingFields from "./BookingFields";

export default function BookingPage({ court }) {
  const { user } = useAuth();

  if (!user) return <div>Devi fare login per prenotare un campo</div>;

  return (
    <div>
      <h2>Prenotazioni</h2>
      <BookingFields court={court} />
    </div>
  );
}
