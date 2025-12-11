import React from 'react'

export default function UserProfile({ user }) {
  return (
    <div>
      <h2>Profilo Utente</h2>
      <p>Email: {user?.email}</p>
      {/* Altre info utente */}

      {/* Qui non includiamo componenti torneo per evitare confusione */}
    </div>
  )
}
