const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (!user) {
    console.log('Nessun user, redirect login');
    return <Navigate to="/login" replace />;
  }

  console.log('Utente:', user, 'Ruolo:', role);

  // FORZA bypass come admin
  if (role !== 'admin' && adminOnly) {
    console.log('Accesso negato: non admin');
    return <Navigate to="/login" replace />;
  }

  return children;
};
