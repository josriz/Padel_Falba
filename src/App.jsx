import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

import LoginForm from "./components/LoginForm";
import DashboardWrapper from "./components/DashboardWrapper";
import Prenotazioni from "./components/Prenotazioni";
import EventiTornei from "./components/EventiTornei";
import Marketplace from "./components/Marketplace";
import Profilo from "./components/Profilo";

function LoginWrapper({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = (user) => {
    onLogin(user);
    navigate("/", { replace: true }); // redirect a dashboard
  };

  return <LoginForm onLogin={handleLogin} />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setUser(data.session.user);
        setIsAdmin(data.session.user.user_metadata?.role === "admin");
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsAdmin(session?.user?.user_metadata?.role === "admin");
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Caricamento...</p>;

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="*" element={<LoginWrapper onLogin={setUser} />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<DashboardWrapper user={user} isAdmin={isAdmin} setUser={setUser} />} />
          <Route path="/prenotazioni" element={<Prenotazioni user={user} />} />
          <Route path="/eventi" element={<EventiTornei user={user} isAdmin={isAdmin} />} />
          <Route path="/marketplace" element={<Marketplace user={user} />} />
          <Route path="/profilo" element={<Profilo user={user} />} />
          {/* Redirect 404 a dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
}
