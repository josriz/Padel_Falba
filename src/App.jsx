import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSupabase } from './SupabaseContext';
import PublicLayout from './PublicLayout';
import Auth from './components/Auth';
import DashboardWrapper from './components/DashboardWrapper';

// Componenti reali da visualizzare nelle rotte figlie
import EventiTornei from './components/EventiTornei';
import Prenotazioni from './components/Prenotazioni';
import Marketplace from './components/Marketplacelist';
import Profilo from './components/Profilo';
import HomePage from './components/HomePage';
import GestioneEventiAdmin from './components/GestioneEventiAdmin';

const ADMIN_EMAIL = 'giose.rizzi@gmail.com';

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const supabase = useSupabase();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Errore durante il logout:', error.message);
    }
  };

  useEffect(() => {
    // Forza logout all'avvio per mostrare pagina login
    const forceLogoutAndReset = async () => {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
    };
    forceLogoutAndReset();

    const setAuthUser = (session) => {
      if (session?.user) {
        const isUserAdmin = session.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        setUser(session.user);
        setIsAdmin(isUserAdmin);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    const getInitialSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setAuthUser(session);
      } catch {
        setAuthError("Errore di connessione al servizio di autenticazione.");
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}>Caricamento stato utente...</div>;
  if (authError) return <div style={{ textAlign: 'center', padding: 50, color: 'red' }}>Errore di Autenticazione: {authError}</div>;

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={!user ? <Auth /> : <Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="/dashboard/*" element={
        <ProtectedRoute user={user}>
          <DashboardWrapper user={user} isAdmin={isAdmin} onLogout={handleLogout} />
        </ProtectedRoute>
      }>
        <Route index element={<HomePage />} />
        <Route path="prenotazioni" element={<Prenotazioni />} />
        <Route path="torneo" element={<EventiTornei isAdmin={isAdmin} />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="profilo" element={<Profilo />} />
        <Route path="gestione-eventi" element={<GestioneEventiAdmin />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
