// src/App.jsx - ✅ CORRETTO import AuthProvider
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthProvider'; // ✅ CORRETTO!

// Componenti principali
import LoginPages from './components/LoginPages';
import Dashboard from './components/Dashboard';
import MarketplaceList from './components/MarketplaceList';
import MarketplaceGestion from './components/MarketplaceGestion';
import TournamentList from './components/TournamentList';
import TournamentDetailPage from './components/TournamentDetailPage';
import NotFound from './components/NotFound'; // ✅ AGGIUNTO!

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/login" element={<LoginPages />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/marketplace" element={
          <ProtectedRoute>
            <MarketplaceList />
          </ProtectedRoute>
        } />
        <Route path="/marketplace/gestione" element={
          <ProtectedRoute adminOnly>
            <MarketplaceGestion />
          </ProtectedRoute>
        } />
        <Route path="/tornei" element={
          <ProtectedRoute>
            <TournamentList />
          </ProtectedRoute>
        } />
        <Route path="/torneo/:id" element={
          <ProtectedRoute adminOnly>
            <TournamentDetailPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>
        } />
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
