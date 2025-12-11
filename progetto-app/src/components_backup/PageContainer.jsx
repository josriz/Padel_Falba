// src/components/PageContainer.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React from 'react';

export default function PageContainer({ children, title = "PadelClub" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* ✅ HEADER IDENTICO DASHBOARD */}
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              PC
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Dashboard PadelClub - Gestione completa
          </p>
        </div>

        {/* ✅ CONTENT CONTAINER COMPATTO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all hover:-translate-y-0.5">
          {children}
        </div>
      </div>
    </div>
  );
}
