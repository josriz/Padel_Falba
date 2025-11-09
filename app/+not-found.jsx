// app/+not-found.jsx

import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <Text style={{ color: '#f1f5f9', fontSize: 24 }}>404 - Pagina non trovata</Text>
      </View>
    </>
  );
}