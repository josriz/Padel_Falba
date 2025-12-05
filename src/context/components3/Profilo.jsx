import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Star, Edit3, Camera, Save, Trophy, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from "../context/AuthProvider";

export default function Profilo() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    nome: user?.email?.split('@')[0] || 'Giocatore Padel',
    email: user?.email || '',
    telefono: '+39 123 456 789',
    livello: 'Intermedio',
    citta: 'Bari, Puglia',
    dataNascita: '15/05/1990',
    bio: 'Appassionato di padel, organizzo tornei locali e cerco compagni di gioco.',
    follower: 124,
    torneiVinti: 8,
    oreGiocate: 256
  });

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setEditMode(false);
    // Qui salveresti su Supabase
    console.log('Profilo salvato:', profileData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* HEADER PROFILO */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">👤 Il tuo Profilo</h1>
        <p className="text-xl text-gray-600">Gestisci le tue informazioni personali</p>
      </div>

      {/* CARD PRINCIPALE PROFILO */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* COVER & AVATAR */}
        <div className="relative h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all">
            <Camera size={20} className="text-white" />
          </button>
        </div>
        
        <div className="relative px-8 pb-8 -mt-16">
          <div className="w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto border-8 border-white shadow-2xl flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {profileData.nome.charAt(0)}
            </span>
          </div>
          
          <div className="text-center mt-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{profileData.nome}</h2>
            <div className="flex items-center justify-center space-x-4 mb-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Star className="fill-yellow-400 text-yellow-400" size={18} />
                <span>{profileData.livello}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Trophy size={18} />
                <span>{profileData.torneiVinti} tornei vinti</span>
              </span>
            </div>
            
            {editMode ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
                <input
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="w-full max-w-md p-3 border border-gray-300 rounded-xl text-center"
                  placeholder="La tua bio..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
                  >
                    <Save size={20} className="inline mr-2" /> Salva
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-lg text-gray-600 max-w-md mx-auto mb-6 px-4">{profileData.bio}</p>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center mx-auto space-x-2"
                >
                  <Edit3 size={20} />
                  <span>Modifica Profilo</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* INFORMAZIONI PERSONALI */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <Mail size={24} />
            <span>Informazioni di Contatto</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Mail size={20} className="text-gray-500" />
              <span className="font-semibold">{profileData.email}</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Phone size={20} className="text-gray-500" />
              <span className="font-semibold">{profileData.telefono}</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <MapPin size={20} className="text-gray-500" />
              <span className="font-semibold">{profileData.citta}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
            <CalendarIcon size={24} />
            <span>Statistiche Padel</span>
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl text-white">
              <div className="text-2xl font-bold">{profileData.oreGiocate}</div>
              <div className="text-sm opacity-90">Ore giocate</div>
            </div>
            <div className="p-4 bg-gradient-to-b from-green-500 to-green-600 rounded-xl text-white">
              <div className="text-2xl font-bold">{profileData.follower}</div>
              <div className="text-sm opacity-90">Follower</div>
            </div>
            <div className="p-4 bg-gradient-to-b from-purple-500 to-purple-600 rounded-xl text-white">
              <div className="text-2xl font-bold">{profileData.torneiVinti}</div>
              <div className="text-sm opacity-90">Tornei vinti</div>
            </div>
          </div>
        </div>
      </div>

      {/* AZIONI RAPIDE */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-3xl text-white text-center">
        <h3 className="text-2xl font-bold mb-6">Pronto per giocare?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-white text-indigo-600 py-4 px-6 rounded-2xl font-bold hover:bg-gray-100 transition-all">📅 Prenota Campo</button>
          <button className="bg-white text-indigo-600 py-4 px-6 rounded-2xl font-bold hover:bg-gray-100 transition-all">🏆 Iscriviti Torneo</button>
          <button className="bg-white text-indigo-600 py-4 px-6 rounded-2xl font-bold hover:bg-gray-100 transition-all">👥 Trova Compagno</button>
        </div>
      </div>
    </div>
  );
}
