import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: '#052844',
        headerStyle: {
          backgroundColor: 'white',
        },
        headerShadowVisible: true,
        headerTintColor: '#052844',
        tabBarStyle: {
        backgroundColor: 'white',
        },
    }}>
      <Tabs.Screen name="index" 
        options={{ 
            title: 'Beranda',
            tabBarIcon: ({ color, focused}) => (
                <Ionicons name={focused ? 'home-sharp' : 'home-outline'} size={24} color={color} />
            ), }} />
      <Tabs.Screen name="about" 
        options={{ 
            title: 'Tentang Kami',
            tabBarIcon: ({ color, focused}) => (
                <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={24} color={color} />
            ), }} />
    </Tabs>
  );
}