// src/components/PageContainer.jsx - GRAFICA ELEGANTE GLOBAL
import React from 'react';

export default function PageContainer({ children, title = "CieffePadel" }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-light text-slate-800">{title}</h1>
        </div>
      </header>
      <main className="pt-8 max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
