import React from 'react';

export default function MarketplaceList() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">🛒 Marketplace</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <div className="w-full h-48 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">Racchetta</span>
          </div>
          <h3 className="font-bold text-xl mb-2">Head Graphene</h3>
          <p className="text-2xl font-bold text-green-600 mb-4">€120</p>
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Acquista</button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">Scarpe</span>
          </div>
          <h3 className="font-bold text-xl mb-2">Asics Gel</h3>
          <p className="text-2xl font-bold text-green-600 mb-4">€89</p>
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Acquista</button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
          <h3 className="font-bold text-xl mb-4">Vendi il tuo!</h3>
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-bold">+ Pubblica Annuncio</button>
        </div>
      </div>
    </div>
  );
}
