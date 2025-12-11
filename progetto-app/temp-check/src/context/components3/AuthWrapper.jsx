import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Outlet, useNavigate } from 'react-router-dom'

function AuthWrapper() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const onLogout = async () => {
    console.log('Logout triggered')
    await supabase.auth.signOut()
    setSession(null)
    navigate('/')
  }

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession()
      setSession(initialSession)
      setLoading(false)

      if (!initialSession) {
        navigate('/')
      }
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) navigate('/')
    })

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [navigate])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50, fontSize: '1.5em' }}>Caricamento app...</div>
  }

  const isAdmin = session?.user?.user_metadata?.role === 'admin'

  return <Outlet context={{ user: session?.user ?? null, isAdmin, onLogout }} />
}

export default AuthWrapper
