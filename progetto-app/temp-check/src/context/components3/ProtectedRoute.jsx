import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Caricamento...</div>; // puoi sostituire con spinner
  }

  // se non loggato → redirect login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // se richiesta admin ma user non è admin → redirect home/dashboard user
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // se tutto ok → render children
  return children;
}
