// src/pages/TabellonePage.jsx
import React from 'react';
import TournamentBracket from '../components/TournamentBracket'; // percorso da pages → components

export default function TabellonePage() {
  return (
    <div className="min-h-screen bg-sky-100 py-10">
      <h1 className="text-3xl font-black text-center mb-8">
        Tabellone Demo
      </h1>

      <TournamentBracket />
    </div>
  );
}
