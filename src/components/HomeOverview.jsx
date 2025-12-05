// src/components/HomeOverview.jsx
import React from "react";
import { Home } from "lucide-react";

export default function HomeOverview() {
  return (
    <div className="p-12 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-28 h-28 bg-white rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-sm border border-gray-200 relative">
          <Home className="w-12 h-12 text-green-700" />
        </div>

        <h1 className="text-4xl font-bold text-green-800 mb-4 bg-white py-6 px-12 rounded-3xl inline-block shadow-lg border border-green-200">
          Benvenuto!
        </h1>

        <p className="text-lg text-gray-700 max-w-xl mx-auto bg-white py-8 px-10 rounded-3xl shadow-lg border border-gray-200">
          Accedi a tornei, marketplace e alla tua area personale dal menu.
        </p>
      </div>
    </div>
  );
}
