import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ user, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏓 Padel Manager</Text>
      <Text style={styles.subtitle}>Benvenuto, {user?.email}!</Text>
      <Text style={styles.text}>Gestisci tornei, partite e prenotazioni.</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#1f2937', padding:20 },
  title: { fontSize:28, fontWeight:'bold', color:'#10b981' },
  subtitle: { fontSize:16, color:'#f3f4f6', marginTop:10 },
  text: { color:'#9ca3af', marginTop:20, textAlign:'center' },
  logoutButton: { marginTop:30, backgroundColor:'#ef4444', paddingVertical:12, paddingHorizontal:24, borderRadius:8 },
  logoutText: { color:'#fff', fontWeight:'bold' }
});
