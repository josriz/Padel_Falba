// app/_layout.jsx

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Stack, useSegments, router } from 'expo-router';
import { supabase } from '../src/supabaseClient'; // Percorso corretto

// Questo componente si occupa del reindirizzamento in base allo stato utente
function InitialLayout() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const segments = useSegments();
    const inAuthGroup = segments[0] === '(auth)';

    useEffect(() => {
        // 1. Controlla la sessione iniziale
        supabase.auth.getSession().then(({ data }) => {
            setUser(data?.session?.user || null);
            setLoading(false);
        });

        // 2. Ascolta i cambiamenti di stato
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // 3. Logica di reindirizzamento
    useEffect(() => {
        if (loading) return;

        if (user && inAuthGroup) {
            router.replace('/(app)');
        } else if (!user && !inAuthGroup) {
            router.replace('/(auth)');
        }
    }, [user, loading, inAuthGroup]);

    // Visualizza un caricamento iniziale
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10b981" />
            </View>
        );
    }

    // 🚨 RITORNO CORRETTO: I gruppi (auth) e (app) vengono scoperti automaticamente.
    return (
        <Stack>
            {/* Solo rotte non convenzionali e fallback */}
            <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} /> 
            
            {/* Se hai una cartella (tabs) va dichiarata qui */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            
            {/* NON DICHIARARE (auth) e (app) */}
        </Stack>
    );
}

// Layout principale esportato
export default function RootLayout() {
    return <InitialLayout />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
    },
});