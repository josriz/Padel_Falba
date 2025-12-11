import React from 'react';

export default function Prenotazioni() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">📅 Prenotazioni Campo</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="font-bold text-xl mb-6">Calendario Settimana</h3>
          <div className="grid grid-cols-7 gap-2 text-sm text-center">
            <div className="bg-blue-100 p-2 font-bold rounded">Lun</div>
            <div>10:00</div><div className="bg-green-100">Libero</div>
            <div>16:00</div><div className="bg-red-100">Prenotato</div>
            <div>19:00</div><div className="bg-green-100">Libero</div>
          </div>
        </div>
        <div className="bg-gradient-to-b from-green-400 to-green-500 p-8 rounded-xl text-white text-center">
          <h3 className="font-bold text-xl mb-6">Prenota Ora!</h3>
          <select className="w-full p-3 mb-4 rounded-lg bg-white text-green-900">
            <option>Campo 1</option>
            <option>Campo 2</option>
          </select>
          <button className="w-full bg-white text-green-500 py-3 px-6 rounded-xl font-bold hover:bg-gray-100">CONFERMA PRENOTAZIONE</button>
        </div>
      </div>
    </div>
  );
}
