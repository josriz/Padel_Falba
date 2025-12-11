import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(-1)}
      className="fixed top-6 left-6 z-50 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all border-4 border-gray-400 backdrop-blur-sm"
    >
      ← INDIETRO
    </button>
  );
}
