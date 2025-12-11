import React from "react";

export default function AccessDenied({ role }) {
  return (
    <div className="p-12 text-center text-red-600 text-lg font-semibold">
      🚫 Accesso Negato - Solo {role || "Admin"}
    </div>
  );
}
