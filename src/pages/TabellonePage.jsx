// src/pages/TabellonePage.jsx
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import TournamentBracket from "../components/TournamentBracket";

export default function TabellonePage() {
  const { tournamentId } = useParams();
  console.log("TabellonePage params tournamentId:", tournamentId);

  if (!tournamentId) {
    console.error("Errore: ID torneo non definito! Redirect a /tournaments");
    return <Navigate to="/tournaments" replace />;
  }

  return (
    <div className="p-4">
      {/* Il bottone Indietro sta già DENTRO TournamentBracket */}
      <TournamentBracket tournamentId={tournamentId} />
    </div>
  );
}
