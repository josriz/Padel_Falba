import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { supabase } from "../supabaseClient";

export default function AuthComponent({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // login / register / reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // LOGIN
  async function handleSignIn() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert("Errore login", error.message);
    else {
      Alert.alert("Benvenuto!", `Accesso effettuato come ${data.user.email}`);
      if (onLoginSuccess) onLoginSuccess(data.user);
    }
  }

  // REGISTRAZIONE
  async function handleSignUp() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) Alert.alert("Errore registrazione", error.message);
    else Alert.alert("Registrazione avvenuta", "Controlla la tua email per confermare");
  }

  // RESET PASSWORD
  async function handleResetPassword() {
    if (!email) return Alert.alert("Inserisci l'email per il reset");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://padel-falba.onrender.com/reset-password",
    });
    setLoading(false);
    if (error) Alert.alert("Errore reset", error.message);
    else Alert.alert("Email inviata", "Controlla la tua email per il link di reset");
  }

  // LOGIN SOCIAL
  async function signInWithProvider(provider) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    setLoading(false);
    if (error) Alert.alert("Errore login social", error.message);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Image
          source={{ uri: "https://via.placeholder.com/120x120.png?text=Logo" }}
          style={styles.logo}
        />

        <Text style={styles.title}>
          {mode === "login" ? "Accedi" : mode === "register" ? "Registrati" : "Reset Password"}
        </Text>

        {(mode !== "reset") && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </>
        )}

        {mode === "login" && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.login]}
              onPress={handleSignIn}
              disabled={loading || !email || !password}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Accedi</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.social]}
              onPress={() => signInWithProvider("google")}
            >
              <Text style={styles.buttonText}>Accedi con Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.social]}
              onPress={() => signInWithProvider("facebook")}
            >
              <Text style={styles.buttonText}>Accedi con Facebook</Text>
            </TouchableOpacity>
          </>
        )}

        {mode === "register" && (
          <TouchableOpacity
            style={[styles.button, styles.register]}
            onPress={handleSignUp}
            disabled={loading || !email || !password}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrati</Text>}
          </TouchableOpacity>
        )}

        {mode === "reset" && (
          <TouchableOpacity
            style={[styles.button, styles.reset]}
            onPress={handleResetPassword}
            disabled={loading || !email}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Invia email reset</Text>}
          </TouchableOpacity>
        )}

        <View style={styles.links}>
          {mode !== "login" && (
            <TouchableOpacity onPress={() => setMode("login")}>
              <Text style={styles.linkText}>Torna al login</Text>
            </TouchableOpacity>
          )}
          {mode === "login" && (
            <>
              <TouchableOpacity onPress={() => setMode("register")}>
                <Text style={styles.linkText}>Registrati</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode("reset")}>
                <Text style={styles.linkText}>Password dimenticata?</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0f172a",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#334155",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    color: "#f8fafc",
    marginBottom: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  login: { backgroundColor: "#3b82f6" },
  register: { backgroundColor: "#2563eb" },
  reset: { backgroundColor: "#f59e0b" },
  social: { backgroundColor: "#db4437" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  links: { flexDirection: "row", justifyContent: "space-around", marginTop: 8 },
  linkText: { color: "#93c5fd", textDecorationLine: "underline" },
});
