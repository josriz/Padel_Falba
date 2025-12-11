import React from 'react';
import { BarChart2, Calendar, Users, Award, TrendingUp, TrendingDown } from 'lucide-react';

const stats = [
  { id: 1, name: 'Partite Totali Giocate', stat: '154', icon: Calendar, change: '+12.5%', color: 'indigo' },
  { id: 2, name: 'Tasso Vittorie (Ultimo Mese)', stat: '78.2%', icon: Award, change: '+3.1%', color: 'lime' },
  { id: 3, name: 'Punteggio Medio Partita', stat: '6-4 / 6-3', icon: BarChart2, change: '-0.5%', color: 'orange' },
  { id: 4, name: 'Nuovi Compagni Trovati', stat: '8', icon: Users, change: '+2', color: 'sky' },
];

const colorMap = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  lime: { bg: 'bg-lime-50', text: 'text-lime-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
};

const DashboardOverview = () => {
  return (
    <div className="p-6">
      {/* Header di Benvenuto */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        Panoramica Statistiche 👋
      </h1>
      <p className="text-gray-500 mb-10">
        Ecco un riepilogo rapido delle tue performance sul campo da Padel.
      </p>

      {/* STAT CARDS: VETRINA DATI CHIAVE */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const ChangeIcon = item.change.startsWith('+') ? TrendingUp : TrendingDown;
          const changeColor = item.change.startsWith('+') ? 'text-lime-600' : 'text-red-600';
          const iconBg = colorMap[item.color]?.bg || 'bg-gray-100';
          const iconColor = colorMap[item.color]?.text || 'text-gray-600';

          return (
            <div
              key={item.id}
              className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100"
            >
              <div className="flex items-center">
                {/* Icona con Sfondo Sfumato */}
                <div className={`${iconBg} rounded-xl p-3 flex-shrink-0`}>
                  <item.icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
                </div>

                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{item.name}</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">
                    {item.stat}
                  </p>
                </div>
              </div>

              {/* Indicatore di Tendenza */}
              <div className="mt-4 flex items-center">
                <ChangeIcon className={`flex-shrink-0 h-5 w-5 ${changeColor}`} aria-hidden="true" />
                <p className={`ml-2 text-sm font-semibold ${changeColor}`}>
                  {item.change}
                  <span className="ml-1 text-gray-400 font-normal">vs. Mese Precedente</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sezione Contenuto (Esempio) */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
          Prossimi Tornei e Prenotazioni
        </h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400 text-lg">
            Qui verranno visualizzati i grafici e la lista dettagliata degli eventi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
