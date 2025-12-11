import React from "react";
import { useAuth } from "../context/AuthProvider";

export default function DashboardAdmintest() {
  const { user } = useAuth();
  const isAdmin = user?.profile?.role === "admin";

  if (!isAdmin) return <div>Accesso negato</div>;

  return (
    <div>
      <h2>Dashboard Admin Test</h2>
      {/* Sezione debug/test funzionalità */}
    </div>
  );
}
