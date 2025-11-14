import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // ✅ IMPORT CORRETTO
import { Outlet, useNavigate } from 'react-router-dom';

function AuthWrapper() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            // Ottiene la sessione iniziale
            const { data: { session: initialSession } } = await supabase.auth.getSession();
            setSession(initialSession);
            setLoading(false); // ✅ RILASCIA IL CARICAMENTO DOPO IL PRIMO CHECK

            if (!initialSession) {
                // Se necessario, reindirizza al login
                // navigate('/login'); 
            }
        };

        checkSession();

        // Listener per login/logout in tempo reale
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                
                if (event === 'SIGNED_OUT' || !session) {
                    // navigate('/login'); // Reindirizza al login
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.5em' }}>Caricamento app...</div>;
    }

    // Passa l'oggetto 'user' a tutti i componenti figli
    return <Outlet context={{ user: session?.user ?? null }} />;
}

export default AuthWrapper;