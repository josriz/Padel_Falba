import React, { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../supabaseClient"

const TournamentListAndAdmin = () => {
  const { isAdmin } = useAuth()
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Fetch tornei all'avvio
  useEffect(() => {
    if (!isAdmin) return
    setLoading(true)
    setError(null)
    supabase
      .from("tournaments")
      .select("*")
      .then(({ data, error }) => {
        if (error) setError(error.message)
        setTournaments(data || [])
        setLoading(false)
      })
  }, [isAdmin])

  if (!isAdmin) return <p className="p-4 text-red-600">Accesso negato: solo admin.</p>
  if (loading) return <div className="p-4 text-indigo-500">Caricamento tornei...</div>
  if (error) return <div className="p-4 bg-red-100 text-red-600">Errore: {error}</div>
  if (tournaments.length === 0) return <div className="p-4 text-gray-600 italic">Nessun torneo creato.</div>

  const handleDelete = async id => {
    setDeletingId(id)
    const { error } = await supabase.from("tournaments").delete().eq("id", id)
    if (error) {
      alert("Errore in eliminazione: " + error.message)
      setDeletingId(null)
      return
    }
    setTournaments(prev => prev.filter(t => t.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="max-w-lg mx-auto mt-6 bg-white border rounded shadow p-4">
      <h2 className="text-xl font-bold mb-3 text-indigo-900">Gestione Tornei (Admin)</h2>
      <ul className="space-y-2">
        {tournaments.map(t => (
          <li key={t.id} className="flex items-center justify-between p-2 border-b">
            <span className="font-medium">{t.name}</span>
            <button
              onClick={() => handleDelete(t.id)}
              disabled={deletingId === t.id}
              className={`ml-4 px-3 py-1 rounded bg-red-500 text-white text-sm ${deletingId === t.id ? "opacity-50 pointer-events-none" : ""}`}
            >
              {deletingId === t.id ? "Elimino..." : "Elimina"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TournamentListAndAdmin
