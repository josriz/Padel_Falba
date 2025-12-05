import React from 'react';
import { useAuth } from '../context/AuthProvider';

export default function DashboardOverview() {
  const { user, isAdmin } = useAuth();

  if (!user) return <div>Devi fare login</div>;

  return (
    <div>
      <h2>Panoramica Dashboard</h2>
      {isAdmin ? (
        <p>Statistiche globali del club</p>
      ) : (
        <p>Statistiche personali</p>
      )}
    </div>
  );
}
