// src/context/TournamentContext.jsx
import React, { createContext, useContext, useState } from 'react';

const TournamentContext = createContext();

export function TournamentProvider({ children, tournamentId }) {
  const [bracketSlots, setBracketSlots] = useState(Array(32).fill(null));
  
  return (
    <TournamentContext.Provider value={{ 
      bracketSlots, 
      setBracketSlots, 
      tournamentId 
    }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament deve essere usato dentro TournamentProvider');
  }
  return context;
}
