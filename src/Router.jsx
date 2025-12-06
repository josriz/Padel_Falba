import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { supabase } from './supabaseClient';

// ✅ SOLO ADMIN (7 file)
import TournamentAdminPanel from './components/TournamentAdminPanel';
import TournamentList from './components/TournamentList';
import TournamentDetail from './components/TournamentDetail';
import TournamentPlayers from './components/TournamentPlayers';
import TournamentBracket from './components/TournamentBracket';
import TournamentBoardAdmin from './components/TournamentBoardAdmin';
import TournamentBracket from './components/TournamentBracket';


// Pagine base
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, role, loading } = useAuth(); // ✅ uso role dal context
  
  if (loading) return <div>Caricamento...</div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  const isAdmin = role === 'admin';
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/marketplace" element={<Marketplace />} />

        {/* STANDARD USER */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }/>
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }/>
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }/>

        {/* ADMIN ONLY */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <div>Admin Dashboard</div>
          </ProtectedRoute>
        }/>
        <Route path="/admin/tournaments" element={
          <ProtectedRoute adminOnly>
            <TournamentAdminPanel />
          </ProtectedRoute>
        }/>
        <Route path="/tournaments" element={
          <ProtectedRoute adminOnly>
            <TournamentList />
          </ProtectedRoute>
        }/>
        <Route path="/tournaments/:id" element={
          <ProtectedRoute adminOnly>
            <TournamentDetail />
          </ProtectedRoute>
        }/>
        <Route path="/tournaments/:id/players" element={
          <ProtectedRoute adminOnly>
            <TournamentPlayers />
          </ProtectedRoute>
        }/>
        <Route path="/tournaments/:id/bracket" element={
          <ProtectedRoute adminOnly>
            <TournamentBracket />
          </ProtectedRoute>
        }/>
        <Route path="/tournaments/:id/board" element={
          <ProtectedRoute adminOnly>
            <TournamentBoardAdmin />
          </ProtectedRoute>
        }/>
        <Route path="/tournaments/demo/bracket" element={
          <ProtectedRoute adminOnly>
             <TournamentBracket />
          </ProtectedRoute>
        }/>

        {/* 404 */}
        <Route path="*" element={<div>404 Non trovato</div>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
