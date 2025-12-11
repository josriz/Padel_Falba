import React, { useState } from "react"
import { supabase } from "../supabaseClient"

const ResetPassword = () => {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleReset = async () => {
    await supabase.auth.resetPasswordForEmail(email)
    setSent(true)
  }

  return (
    <div>
      <h2>Reset Password</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleReset}>Invia richiesta</button>
      {sent && <p>Email simulata per reset inviata.</p>}
    </div>
  )
}

export default ResetPassword
