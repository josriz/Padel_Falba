// app/(auth)/index.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { supabase } from '../../src/supabaseClient'; 
import { FontAwesome } from '@expo/vector-icons'; 

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) Alert.alert('Errore Login', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      error,
    } = await supabase.auth.signUp({ email, password });

    if (error) Alert.alert('Errore Registrazione', error.message);
    else Alert.alert('Verifica Email', 'Controlla la tua email per il link di verifica!');
    setLoading(false);
  }

  function signInWithSocial(provider) {
    Alert.alert('Funzione non implementata', `Accesso con ${provider} non ancora configurato.`);
  }
  
  function openPrivacyPolicy() {
      // 🚨 CAMBIA QUESTO URL con il link reale della tua politica sulla privacy!
      Linking.openURL('https://il-tuo-sito.it/privacy-policy').catch(err => 
          console.error("Non è stato possibile aprire l'URL:", err)
      );
  }

  return (
    <View style={styles.container}>
      
      {/* 1. LOGO E TITOLO */}
      <Text style={styles.logo}>🏓 Padel Manager</Text>
      <Text style={styles.subtitle}>
        {isRegistering ? 'Crea il tuo account' : 'Accedi al tuo account'}
      </Text>

      {/* 2. FORM EMAIL/PASSWORD */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
        />
      </View>

      {/* 3. PULSANTI PRINCIPALI */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={isRegistering ? signUpWithEmail : signInWithEmail}
        disabled={loading}
      >
        <Text style={styles.primaryText}>
          {loading ? 'Caricamento...' : isRegistering ? 'Registrati' : 'Accedi'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsRegistering(!isRegistering)}
        disabled={loading}
      >
        <Text style={styles.switchText}>
          {isRegistering ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
        </Text>
      </TouchableOpacity>

      {/* 4. SEPARATORE */}
      <Text style={styles.separator}>--- Oppure accedi con ---</Text>

      {/* 5. PULSANTI SOCIAL AGGIORNATI CON LOGHI */}
      <TouchableOpacity
        style={[styles.socialButton, styles.googleButton]}
        onPress={() => signInWithSocial('Google')}
      >
        <FontAwesome name="google" size={20} color="#000" style={styles.socialIcon} /> 
        <Text style={[styles.socialText, {color: '#000'}]}>Accedi con Google</Text> 
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.socialButton, styles.facebookButton]}
        onPress={() => signInWithSocial('Facebook')}
      >
        <FontAwesome name="facebook-f" size={20} color="#fff" style={styles.socialIcon} />
        <Text style={styles.socialText}>Accedi con Facebook</Text>
      </TouchableOpacity>
      
      {/* 6. DICITURA SULLA PRIVACY */}
      <TouchableOpacity 
        style={styles.privacyContainer}
        onPress={openPrivacyPolicy}
      >
        <Text style={styles.privacyText}>
          Continuando accetti la nostra <Text style={styles.privacyLink}>Politica sulla Privacy</Text>
        </Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#f3f4f6',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: '#1f2937',
    color: '#f3f4f6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
  },
  primaryButton: {
    marginTop: 10,
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  separator: {
    color: '#4b5563',
    marginVertical: 30,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1, 
    borderColor: 'transparent',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc', 
  },
  facebookButton: {
    backgroundColor: '#4267b2',
    borderColor: 'transparent', 
  },
  socialIcon: {
    marginRight: 10, 
  },
  socialText: {
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  privacyContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  privacyText: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
  privacyLink: {
    color: '#10b981',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});