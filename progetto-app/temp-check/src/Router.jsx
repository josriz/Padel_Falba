import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { supabase } from './supabaseClient';

// COMPONENTI TORNEI ADMIN
import TournamentAdminPanel from './components/TournamentAdminPanel';
import TournamentList from './components/TournamentList';
import TournamentPlayers from './components/TournamentPlayers';
import TournamentBoardAdmin from './components/TournamentBoardAdmin';
import TournamentBracket from './components/TournamentBracket';

// COMPONENTI UTENTE
import TournamentUserPanel from './components/TournamentUserPanel';

// PAGINE BASE
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>;

  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = role === 'admin';

  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* PUBBLICO */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/marketplace" element={<Marketplace />} />

        {/* UTENTE STANDARD */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        } />
        <Route path="/torneo/:id" element={
          <ProtectedRoute>
            <TournamentUserPanel />
          </ProtectedRoute>
        } />

        {/* ADMIN ONLY */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <div>Admin Dashboard</div>
          </ProtectedRoute>
        } />
        <Route path="/admin/tournaments" element={
          <ProtectedRoute adminOnly>
            <TournamentAdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/admin/tournaments/:id/players" element={
          <ProtectedRoute adminOnly>
            <TournamentPlayers />
          </ProtectedRoute>
        } />
        <Route path="/admin/tournaments/:id/bracket" element={
          <ProtectedRoute adminOnly>
            <TournamentBracket />
          </ProtectedRoute>
        } />
        <Route path="/admin/tournaments/:id/board" element={
          <ProtectedRoute adminOnly>
            <TournamentBoardAdmin />
          </ProtectedRoute>
        } />

        {/* ROUTE DEMO */}
        <Route path="/admin/tournaments/demo/bracket" element={
          <ProtectedRoute adminOnly>
            <TournamentBracket />
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<div className="text-center p-20 text-2xl">404 - Pagina non trovata</div>} />
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
