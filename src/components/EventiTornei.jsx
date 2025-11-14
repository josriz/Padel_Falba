import React from "react";

const EventiTornei = () => {
  const eventi = [
    {
      titolo: "🏆 Torneo Autunnale 2025",
      periodo: "Novembre 2025",
      descrizione:
        "Il classico torneo autunnale del nostro circolo! Iscrizioni aperte a tutte le categorie. Premi per i primi classificati e serata finale con cena di gala.",
      stato: "Iscrizioni aperte",
    },
    {
      titolo: "🌸 Torneo Primaverile 2026",
      periodo: "Aprile 2026",
      descrizione:
        "Evento primaverile che apre la nuova stagione sportiva! Gare singolo, doppio e misto. Ottima occasione per mettere alla prova il tuo livello di gioco.",
      stato: "In programmazione",
    },
  ];

  const handleIscrizione = (titolo) => {
    alert(`Hai selezionato l'iscrizione per: ${titolo}\nLe iscrizioni saranno gestite prossimamente!`);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">🎾 Eventi & Tornei</h1>
      <p className="text-lg mb-10 text-gray-700 leading-relaxed">
        Partecipa ai nostri tornei stagionali! Qui troverai tutte le informazioni su eventi in corso e programmati.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {eventi.map((evento, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-blue-600 text-2xl font-semibold mb-2">{evento.titolo}</h2>
            <p className="font-medium text-gray-600 mb-2">📅 {evento.periodo}</p>
            <p className="text-gray-700 mb-4 leading-normal">{evento.descrizione}</p>
            <span
              className={`inline-block px-4 py-2 rounded-full font-semibold mb-6 ${
                evento.stato === "Iscrizioni aperte" ? "bg-green-500 text-white" : "bg-yellow-400 text-white"
              }`}
            >
              {evento.stato}
            </span>
            <button
              onClick={() => handleIscrizione(evento.titolo)}
              className="bg-blue-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Iscriviti al Torneo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventiTornei;
