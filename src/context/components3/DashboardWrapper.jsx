// src/components/DashboardWrapper.jsx
import React from "react";
import { useAuth } from "../context/AuthProvider";
import SidebarMenu from "./SidebarMenu";
import DashboardAdmin from "./DashboardAdmin";
import DashboardUser from "./DashboardUser";

export default function DashboardWrapper() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="text-center mt-20">Caricamento...</div>;
  if (!user) return <div>Devi fare login</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bottone hamburger + menu a scomparsa */}
      <SidebarMenu />

      {/* Contenuto principale */}
      <main className="p-6 pt-20"> {/* pt-20 per lasciare spazio al bottone in alto */}
        {isAdmin ? <DashboardAdmin /> : <DashboardUser />}
      </main>
    </div>
  );
}
