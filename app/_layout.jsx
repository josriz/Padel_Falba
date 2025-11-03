// app/_layout.jsx

import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../src/supabaseClient';
import { View } from 'react-native';

// Impedisce all'hiding automatico della schermata iniziale di avvenire prima che le risorse siano caricate.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initialState, setInitialState] = useState(null);
  const [session, setSession] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // 1. Ascolta i cambiamenti di stato di autenticazione
  useEffect(() => {
    // Gestisce lo stato iniziale della sessione
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoaded(true);
    });

    // Ascolta i cambiamenti futuri (login, logout, ecc.)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Pulizia
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Nasconde la splash screen quando il progetto è caricato e lo stato di autenticazione è noto
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  if (!loaded) {
    // Mostra una schermata di caricamento finché lo stato della sessione non è noto
    return <View />;
  }

  return <RootLayoutNav session={session} />;
}

// Navigazione principale basata sullo stato di autenticazione
function RootLayoutNav({ session }) {
  // session è true se l'utente è loggato, false/null altrimenti

  return (
    <Stack>
      {/* Il segmento (auth) è l'area di Login/Registrazione
        Header disabilitato per rimuovere la scritta (auth)/index in alto
      */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
      
      {/* Il segmento (app) è l'area protetta (Dashboard, Profilo, ecc.)
        Header disabilitato qui perché usiamo il Drawer Navigator (che ha il suo header)
      */}
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      
      {/* Gestisce le rotte non trovate (404) */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}