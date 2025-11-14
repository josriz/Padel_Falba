import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Layouts e Componenti di Base
import PublicLayout from './components/PublicLayout';
import DashboardWrapper from './components/DashboardWrapper';
import Auth from './components/Auth';

// Componenti Dashboard
import DashboardOverview from './components/DashboardOverview';
import Profilo from './components/Profilo';
import Prenotazioni from './components/Prenotazioni';
import TournamentDashboard from './components/TournamentDashboard';
import EventiTornei from './components/EventiTornei';
import MarketplaceList from './components/MarketplaceList';
import MarketplaceGestion from './components/MarketplaceGestion';
import GestioneEventiAdmin from './components/GestioneEventiAdmin';

const ADMIN_EMAIL = 'giose.rizzi@gmail.com';

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const AdminRoute = ({ user, isAdmin, children }) => {
  if (!user || !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Funzione logout da poter passare a DashboardWrapper
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  // Forza logout automatico all'avvio
  useEffect(() => {
    const forceLogout = async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Errore durante logout automatico:', error);
      }
    };
    forceLogout();
  }, []);

  useEffect(() => {
    const setAuthUser = (session) => {
      if (session?.user) {
        const isUserAdmin = session.user.email === ADMIN_EMAIL;
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthUser(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 50 }}>Caricamento stato utente...</div>;
  if (authError) return <div style={{ textAlign: 'center', padding: 50, color: 'red' }}>Errore di Autenticazione: {authError}</div>;

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
      </Route>
      <Route path="/dashboard/*" element={
        <ProtectedRoute user={user}>
          <DashboardWrapper user={user} isAdmin={isAdmin} onLogout={handleLogout} />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardOverview />} />
        <Route path="profilo" element={<Profilo />} />
        <Route path="prenotazioni" element={<Prenotazioni />} />
        <Route path="torneo" element={<TournamentDashboard />} />
        <Route path="eventi" element={<EventiTornei />} />
        <Route path="marketplace" element={<MarketplaceList />} />
        <Route path="marketplace-gestione" element={<MarketplaceGestion />} />
        <Route path="admin-eventi" element={
          <AdminRoute user={user} isAdmin={isAdmin}>
            <GestioneEventiAdmin />
          </AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
