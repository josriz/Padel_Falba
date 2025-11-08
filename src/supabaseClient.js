// src/supabaseClient.js (Versione FINALE anti-SSR/Web crash)

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants'; 
// !!! NON IMPORTIAMO ASYNCSTORAGE QUI A LIVELLO GLOBALE !!!

// --- CHIAVI DI CONFIGURAZIONE ---
const SUPABASE_URL = 'https://lshvnwryhqlvjhxqscla.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaHZud3J5aHFsdmpoeHFzY2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjE5ODAsImV4cCI6MjA3NzM4MTk4MH0.t_o2-9UbI6_u0gjDVBG_eS-g_sn_m6Oo89l3F9XZ4Dw';

// Funzione di configurazione di base
const authConfig = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
};

// 🚨 LOGICA DI INITIALIZATION POSTICIPATA
// Verifica se siamo in un ambiente mobile/browser (non in SSR di Node)
// `typeof window !== 'undefined'` è la verifica SSR più affidabile.
if (typeof window !== 'undefined' || (Constants.platform && Constants.platform.web !== true)) {
  try {
    // Importiamo Async Storage solo quando siamo sicuri di essere in un ambiente client
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    authConfig.storage = AsyncStorage;
  } catch (e) {
    // Fallback: se l'importazione fallisce, si usa lo storage di default
    console.warn("AsyncStorage not available, falling back to default storage.");
  }
}


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: authConfig,
});