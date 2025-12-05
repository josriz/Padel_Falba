import React, { useState } from "react";
import { Menu } from "lucide-react";
import SidebarMenu from "./SidebarMenu";

export default function DashboardUser({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full bg-white shadow px-4 py-3 flex items-center">
        <button onClick={() => setIsOpen(true)} className="mr-4 text-gray-700">
          <Menu className="w-7 h-7" />
        </button>
        <h1 className="text-xl font-bold">Area Utente</h1>
      </header>
      {isOpen && <SidebarMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />}
      <main className="p-4">{children}</main>
    </div>
  );
}
