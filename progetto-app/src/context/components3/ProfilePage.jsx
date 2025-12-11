import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Edit3, LogOut, ArrowLeft, Save, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

import {
  Bar
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || `${user?.name || ''} ${user?.surname || ''}`.trim(),
    phone: user?.phone || '',
    location: user?.location || 'Bari, Puglia'
  });

  if (!user) {
    return <div className="p-8 text-center">Caricamento profilo...</div>;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // logica per salvare (aggiungere backend/supabase)
    alert('Profilo aggiornato! (implementa salvataggio)');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || `${user?.name || ''} ${user?.surname || ''}`.trim(),
      phone: user?.phone || '',
      location: user?.location || 'Bari, Puglia'
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // Dati esempio per grafico statistiche
  const chartData = {
    labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno'],
    datasets: [
      {
        label: 'Tornei Iscritti',
        data: [2, 1, 0, 3, 2, 4],
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderRadius: 5,
      },
      {
        label: 'Prodotti Acquistati',
        data: [1, 3, 2, 0, 1, 1],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: { beginAtZero: true, stepSize: 1 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/user" 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Dashboard
        </Link>

        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8 mb-8 border border-white/50">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {user.name || 'Nome Utente'}
            </h1>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {user.role === 'admin' ? 'Admin' : 'Utente'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Email */}
            <div className="space-y-3">
              <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-semibold text-gray-900 break-all">{user.email}</p>
                </div>
              </div>

              {/* Nome */}
              <div className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nome Completo</p>
                  {isEditing ? (
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full text-sm font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{formData.fullName || 'Non specificato'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Telefono e Luogo */}
            <div className="space-y-3">
              <div className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Telefono</p>
                  {isEditing ? (
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full text-sm font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{formData.phone || 'Non specificato'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Luogo</p>
                  {isEditing ? (
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full text-sm font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{formData.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chart statistiche */}
          <div className="mb-8">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Bottoni */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                >
                  <Save className="w-4 h-4" />
                  Salva
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Annulla
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              >
                <Edit3 className="w-4 h-4" />
                Modifica
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
