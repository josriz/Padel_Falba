const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, role, loading } = useAuth();

  console.log('🔄 ProtectedRoute CHECK:', { 
    user: user?.email, 
    role, 
    loading, 
    pathname: window.location.pathname,
    adminOnly 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ Nessun user, redirect /');
    return <Navigate to="/" replace />;  // ✅ /
  }

  // ✅ AUTO-REDIRECT / → /dashboard DOPO LOGIN
  if (window.location.pathname === '/') {
    console.log('🚀 AUTO-REDIRECT / → /dashboard:', user.email);
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ Utente OK:', user.email, 'Ruolo:', role);

  // ✅ ADMIN CHECK - I TUOI LOG
  if (role !== 'admin' && adminOnly) {
    console.log('❌ Accesso negato: non admin');
    return <Navigate to="/dashboard" replace />;  // ✅ /dashboard NON /login
  }

  console.log('✅ ProtectedRoute APPROVATO:', role);
  return children;
};
