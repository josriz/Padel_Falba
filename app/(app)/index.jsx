// app/(app)/index.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../src/supabaseClient';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carica i dati dell'utente
    async function loadUser() {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        Alert.alert('Errore Sessione', error.message);
        router.replace('/(auth)');
      } else {
        setUser(user);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleLogout() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Errore Logout', error.message);
      setLoading(false);
    } 
    // Il reindirizzamento al login è gestito da _layout.jsx
  }

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Caricamento sessione...</Text>
      </View>
    );
  }

  // --- CONTENUTO DELLA HOME PAGE ---
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Benvenuto, {user.email}!
      </Text>
      <Text style={styles.bodyText}>
        Gestisci tornei, partite e prenotazioni.
      </Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Il tuo prossimo match</Text>
        <Text style={styles.cardText}>🎾 Nessun match in programma. Prenota ora!</Text>
      </View>
      
      {/* PULSANTE LOGOUT */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={loading}
      >
        <Text style={styles.logoutText}>
          {loading ? 'Disconnessione...' : 'Logout'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f172a', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f3f4f6',
    marginBottom: 10,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 40,
    textAlign: 'center',
  },
  loadingText: {
    color: '#f3f4f6',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#ef4444', 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 50, // Aggiunto un po' di spazio
    width: 200,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1f2937',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#10b981',
  },
  cardTitle: {
    color: '#f3f4f6',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    color: '#9ca3af',
  }
});