// app/(app)/_layout.jsx

import { Drawer } from 'expo-router/drawer';
import { FontAwesome } from '@expo/vector-icons'; 

export default function AppLayout() {
  return (
    <Drawer 
      screenOptions={{
        headerShown: true, // Mostra l'header con l'icona del menu
        drawerActiveTintColor: '#10b981', // Colore attivo del testo nel menu (verde Padel Manager)
        drawerInactiveTintColor: '#f3f4f6', // Colore inattivo (bianco sporco)
        headerStyle: {
          backgroundColor: '#0f172a', // Sfondo scuro dell'header
        },
        headerTintColor: '#10b981', // Colore del testo/icona nell'header
        drawerContentStyle: { 
            backgroundColor: '#0f172a' // Sfondo scuro del menu laterale
        }
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Dashboard", // Titolo che appare nell'header e nel menu
          drawerLabel: "Dashboard", // Etichetta nel menu
          drawerIcon: ({ color }) => <FontAwesome name="home" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Il mio Profilo",
          drawerIcon: ({ color }) => <FontAwesome name="user" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="book"
        options={{
          title: "Prenota il Campo",
          drawerIcon: ({ color }) => <FontAwesome name="calendar" size={20} color={color} />,
        }}
      />
       <Drawer.Screen
        name="events"
        options={{
          title: "Eventi & Tornei",
          drawerIcon: ({ color }) => <FontAwesome name="trophy" size={20} color={color} />,
        }}
      />
      {/* Se vuoi nascondere una schermata dal drawer, aggiungi: drawerItemStyle: { height: 0 } */}
    </Drawer>
  );
}