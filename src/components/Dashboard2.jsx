// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Menu, X, Home, Calendar, User, LogOut, Shield, ShoppingBag, Trophy, Users } from "lucide-react";

// Componenti
import ProfilePage from "./ProfilePage";
import TournamentViewOnly from "./TournamentViewOnly";
import TournamentListAndAdmin from "./TournamentListAndAdmin";
import MarketplaceList from "./MarketplaceList";
import MarketplaceGestion from "./MarketplaceGestion";
import SuperAdminPanel from "./SuperAdminPanel";
import AccessDenied from "./AccessDenied";
import HomeOverview from "./HomeOverview";

export default function Dashboard() {
  const { user, signOut, isAdmin, isSuperAdmin } = useAuth();
  const canAccessAdmin = isAdmin || isSuperAdmin;
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [userStats, setUserStats] = useState({
    tournaments: 12,
    points: 1247,
    rank: 47,
    nextEvent: "Bari Winter Cup - 15 Dic",
  });

  useEffect(() => {
    if (user) {
      setUserStats({
        tournaments: 12 + Math.floor(Math.random() * 5),
        points: 1247 + Math.floor(Math.random() * 100),
        rank: Math.max(1, 47 - Math.floor(Math.random() * 3)),
        nextEvent: "Bari Winter Cup - 15 Dic",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };

  const menuItems = isSuperAdmin
    ? [
        { id: "home", label: "🏠 Dashboard", icon: Home, section: "home" },
        { id: "superadmin", label: "👑 Gestione Utenti", icon: Users, section: "superadmin" },
        { id: "admin", label: "⚙️ Gestione Tornei", icon: Shield, section: "admin-tornei" },
        { id: "eventi", label: "📅 Eventi e Tornei", icon: Calendar, section: "tornei" },
        { id: "marketplace", label: "🛒 Marketplace", icon: ShoppingBag, section: "marketplace-gestione" },
        { id: "profilo", label: "👤 Profilo", icon: User, section: "profilo" },
        { id: "logout", label: "🚪 Logout", icon: LogOut, section: "logout" },
      ]
    : isAdmin
    ? [
        { id: "home", label: "🏠 Dashboard", icon: Home, section: "home" },
        { id: "admin", label: "⚙️ Gestione Tornei", icon: Shield, section: "admin-tornei" },
        { id: "eventi", label: "📅 Eventi e Tornei", icon: Calendar, section: "tornei" },
        { id: "marketplace", label: "🛒 Marketplace", icon: ShoppingBag, section: "marketplace-gestione" },
        { id: "profilo", label: "👤 Profilo", icon: User, section: "profilo" },
        { id: "logout", label: "🚪 Logout", icon: LogOut, section: "logout" },
      ]
    : [
        { id: "home", label: "🏠 Dashboard", icon: Home, section: "home" },
        { id: "eventi", label: "📅 Eventi e Tornei", icon: Calendar, section: "tornei" },
        { id: "marketplace", label: "🛒 Marketplace", icon: ShoppingBag, section: "marketplace" },
        { id: "profilo", label: "👤 Profilo", icon: User, section: "profilo" },
        { id: "logout", label: "🚪 Logout", icon: LogOut, section: "logout" },
      ];

  const SidebarMenu = () => (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer da destra */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 pt-20 border-b border-gray-100 sticky top-0 bg-white z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {user?.email?.split("@")[0]?.replace(/\./g, " ") || "Giocatore"}
            </p>
            <p className="text-xs text-gray-500 font-medium capitalize">
              {isSuperAdmin ? "👑 SuperAdmin" : isAdmin ? "🔧 Amministratore" : "🎾 Giocatore"}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto h-full">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.section);
                setIsOpen(false);
                if (item.section === "logout") handleLogout();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all text-left"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HomeOverview />;
      case "tornei":
        return <TournamentViewOnly />;
      case "superadmin":
        return isSuperAdmin ? <SuperAdminPanel /> : <AccessDenied />;
      case "admin-tornei":
        return canAccessAdmin ? <TournamentListAndAdmin /> : <AccessDenied />;
      case "marketplace-gestione":
        return canAccessAdmin ? <MarketplaceGestion /> : <AccessDenied />;
      case "marketplace":
        return <MarketplaceList />;
      case "profilo":
        return <ProfilePage logout={handleLogout} />;
      case "logout":
        handleLogout();
        return <div className="p-12 text-center">Logout in corso...</div>;
      default:
        return <div className="p-12 text-center">Sezione non trovata</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* HEADER MOBILE */}
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-50">
        <h1 className="text-lg font-semibold">PADEL APP</h1>
        <button onClick={() => setIsOpen(true)}>
          <Menu className="w-7 h-7 text-gray-700" />
        </button>
      </div>

      {isOpen && <SidebarMenu />}

      <main className="pt-4 pb-8 md:pb-12">{renderSection()}</main>
    </div>
  );
}
