// src/App.jsx - ✅ SINGLE ROUTE + TournamentBracketEditable ADMIN
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthProvider";

// 🌟 HOME + PUBLIC
import Home from "./components/Home";
import LoginPages from "./components/LoginPages";
import RegistrationPage from "./components/RegistrationPage";  

// 👤 DASHBOARD USER
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import Marketplace from "./components/Marketplace";

// 🏆 TORNEI
import SingleTournament from "./components/SingleTournament";  // ✅ Tutti sub-path
import TournamentList from "./components/TournamentList";  // Lista admin
import TournamentBracketEditable from "./components/TournamentBracketEditable";  // ✅ ADMIN BOARD

// ⚙️ ADMIN ONLY
import MarketplaceGestion from "./components/MarketplaceGestion";
import TournamentAdminPanel from "./components/TournamentAdminPanel";

// 📱 DEMO + 404
import TabellonePage from "./pages/TabellonePage";
import NotFound from "./components/NotFound";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, role } = useAuth();
  
  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/" replace />;
  
  if (user && window.location.pathname === '/') {
    console.log('🚀 AUTO-REDIRECT → /dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  const isAdmin = role === "admin";
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Routes>
        {/* 🚀 LOGIN HOME */}
        <Route path="/" element={<LoginPages />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* 👤 DASHBOARD */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/marketplace" element={
          <ProtectedRoute>
            <Marketplace />
          </ProtectedRoute>
        } />

        {/* 🏆 TORNEI - SINGLE ROUTE per TUTTI sub-path */}
        <Route path="/tournaments" element={
          <ProtectedRoute>
            <TournamentList />
          </ProtectedRoute>
        } />
        
        {/* ✅ SINGLE Tournament: /:id, /:id/players, /:id/bracket */}
        <Route path="/tournaments/:tournamentId" element={
          <ProtectedRoute>
            <SingleTournament />
          </ProtectedRoute>
        } />
        <Route path="/tournaments/:tournamentId/players" element={
          <ProtectedRoute>
            <SingleTournament />
          </ProtectedRoute>
        } />
        <Route path="/tournaments/:tournamentId/bracket" element={
          <ProtectedRoute>
            <SingleTournament />
          </ProtectedRoute>
        } />
        
        {/* ✅ ADMIN ONLY: /:id/board → TournamentBracketEditable */}
        <Route path="/tournaments/:tournamentId/board" element={
          <ProtectedRoute adminOnly>
            <TournamentBracketEditable />
          </ProtectedRoute>
        } />

        {/* ⚙️ ADMIN */}
        <Route path="/admin/marketplace" element={
          <ProtectedRoute adminOnly>
            <MarketplaceGestion />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <TournamentAdminPanel />
          </ProtectedRoute>
        } />

        {/* 📱 DEMO */}
        <Route path="/tabellone-demo" element={
          <ProtectedRoute>
            <TabellonePage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
