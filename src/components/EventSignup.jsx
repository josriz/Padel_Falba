import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function EventSignup({ eventId, user }) {
  const [eventDetails, setEventDetails] = useState(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventData();
    } else {
      setLoading(false);
      setMessage("ID Evento non specificato.");
    }
  }, [eventId, user]);

  const fetchEventData = async () => {
    setLoading(true);
    setMessage("");
    try {
      const { data: eData, error: eError } = await supabase
        .from("events")
        .select("name, posti_disponibili")
        .eq("id", eventId)
        .single();

      if (eError) throw eError;
      setEventDetails(eData);

      const { data: pData, error: pError } = await supabase
        .from("participants")
        .select("id, user_id")
        .eq("event_id", eventId);

      if (pError) throw pError;

      const currentParticipants = pData;
      setParticipantsCount(currentParticipants.length);

      if (user) {
        const alreadyIn = currentParticipants.some((p) => p.user_id === user.id);
        setIsRegistered(alreadyIn);

        if (!alreadyIn && user.user_metadata) {
          setForm({
            first_name: user.user_metadata.first_name || "",
            last_name: user.user_metadata.last_name || "",
            email: user.email || "",
            phone: user.user_metadata.phone || "",
          });
        }
      }
    } catch (e) {
      setMessage("Errore caricamento dati evento: " + e.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Devi essere loggato per iscriverti.");
      return;
    }

    if (!form.first_name || !form.last_name || !form.email || !form.phone) {
      setMessage("Compila tutti i campi!");
      return;
    }

    if (isRegistered) {
      setMessage("Sei già iscritto a questo evento!");
      return;
    }

    if (eventDetails && participantsCount >= eventDetails.posti_disponibili) {
      setMessage("❌ Iscrizioni chiuse, posti terminati!");
      return;
    }

    const { error } = await supabase.from("participants").insert([
      {
        event_id: eventId,
        user_id: user.id,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
      },
    ]);

    if (error) {
      setMessage("❌ Errore durante l'iscrizione: " + error.message);
    } else {
      setMessage("✅ Iscrizione all'evento completata con successo!");
      setForm({ first_name: "", last_name: "", email: "", phone: "" });
      setIsRegistered(true);
      setParticipantsCount((prev) => prev + 1);
    }
  };

  if (loading)
    return <p className="p-5 text-center text-gray-600">Caricamento dettagli evento...</p>;
  if (!eventDetails)
    return <p className="p-5 text-center text-red-600">Errore: Evento non trovato.</p>;

  const spotsLeft = eventDetails.posti_disponibili - participantsCount;

  return (
    <div className="max-w-lg mx-auto p-5 border border-gray-300 rounded shadow-sm box-border w-full">
      <h2 className="text-2xl font-semibold mb-3">Iscrizione: {eventDetails.name}</h2>
      <p className="mb-4">Posti disponibili: <strong>{spotsLeft}</strong> / {eventDetails.posti_disponibili}</p>

      {message && (
        <p
          className={`mb-4 p-3 rounded ${
            message.startsWith("❌")
              ? "bg-red-100 text-red-700 border border-red-400"
              : "bg-green-100 text-green-700 border border-green-400"
          }`}
        >
          {message}
        </p>
      )}

      {isRegistered ? (
        <p className="text-green-700 p-3 border border-green-400 rounded">
          Sei già iscritto a questo evento. Ti aspettiamo! 🎉
        </p>
      ) : spotsLeft <= 0 ? (
        <p className="text-red-700 p-3 border border-red-400 rounded">
          Posti esauriti. Non è possibile iscriversi.
        </p>
      ) : (
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <p className="text-gray-600 mb-2">Compila i tuoi dati per confermare l'iscrizione.</p>

          <input
            name="first_name"
            placeholder="Nome"
            value={form.first_name}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <input
            name="last_name"
            placeholder="Cognome"
            value={form.last_name}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <input
            name="phone"
            placeholder="Cellulare"
            value={form.phone}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded"
          />

          <button
            type="submit"
            className="py-3 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer mt-2"
          >
            Conferma Iscrizione
          </button>
        </form>
      )}
    </div>
  );
}
