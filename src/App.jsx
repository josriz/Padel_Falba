import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { supabase } from "./supabaseClient";

import LoginForm from "./components/LoginForm";
import DashboardWrapper from "./components/DashboardWrapper";
import Prenotazioni from "./components/Prenotazioni";
import EventiTornei from "./components/EventiTornei";
import Marketplace from "./components/Marketplace";
import Profilo from "./components/Profilo";

function LoginWrapper({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = (session) => {
    onLogin(session);
    navigate("/", { replace: true });
  };

  return <LoginForm onLogin={handleLogin} />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Funzione per estrarre ruoli dal token JWT
  const getRolesFromSession = (session) => {
    if (!session || !session.access_token) return [];
    try {
      const jwtPayload = JSON.parse(atob(session.access_token.split(".")[1]));
      return jwtPayload.roles || [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setUser(data.session.user);
        const roles = getRolesFromSession(data.session);
        setIsAdmin(roles.includes("admin"));
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        const roles = getRolesFromSession(session);
        setIsAdmin(roles.includes("admin"));
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Caricamento...</p>;

  const handleLogout = () => {
    setUser(null);
    supabase.auth.signOut();
  };

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="*" element={<LoginWrapper onLogin={setUser} />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <DashboardWrapper
                user={user}
                isAdmin={isAdmin}
                setUser={setUser}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="/prenotazioni" element={<Prenotazioni user={user} />} />
          <Route
            path="/eventi"
            element={<EventiTornei user={user} isAdmin={isAdmin} />}
          />
          <Route path="/marketplace" element={<Marketplace user={user} />} />
          <Route
            path="/profilo"
            element={<Profilo user={user} onLogout={handleLogout} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
}
