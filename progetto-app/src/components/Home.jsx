// src/components/HomePage.jsx - ✅ EXPORT DEFAULT FIXATO
import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Icon */}
        <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl border-4 border-white">
          <svg className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
          CieffePadel Bari
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
          Tornei padel, marketplace attrezzature, classifiche Puglia
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link 
            to="/login" 
            className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 min-w-[200px] text-center"
          >
            👤 Entra ora
          </Link>
          <Link 
            to="/register" 
            className="px-10 py-5 border-3 border-emerald-600 text-emerald-600 font-black text-xl rounded-3xl hover:bg-emerald-600 hover:text-white transition-all duration-300 min-w-[200px]"
          >
            ✨ Registrati
          </Link>
        </div>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-emerald-100">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tornei Live</h3>
            <p className="text-gray-600">Iscriviti e gioca tornei 2v2 Bari</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-blue-100">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 13H9v-2h1v2zm0-4H9V7h1v4z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Marketplace</h3>
            <p className="text-gray-600">Compra/vendi racchette usate Bari</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-purple-100">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Classifiche</h3>
            <p className="text-gray-600">Rank Puglia e statistiche live</p>
          </div>
        </div>
      </div>
    </div>
  );
}
