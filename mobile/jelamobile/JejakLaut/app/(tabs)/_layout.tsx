import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View, Text, Animated } from 'react-native';
import { useRef } from 'react';

export default function TabLayout() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateIcon = (focused: boolean) => {
    Animated.timing(scaleAnim, {
      toValue: focused ? 1.2 : 1, // Perbesar jika focused
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#052844',
        headerStyle: {
          backgroundColor: 'white',
        },
        headerShadowVisible: true,
        headerTintColor: '#052844',
        headerTitleStyle: {
          fontFamily: 'Montserrat-Bold',
        },
        tabBarStyle: {
          backgroundColor: 'white',
          height: 70, // Tinggi tab bar
          borderTopLeftRadius: 20, // Lengkungan pada tab bar
          borderTopRightRadius: 20,
          position: 'absolute', // Agar tab bar tetap terlihat
          left: 0,
          right: 0,
          bottom: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        },
        tabBarShowLabel: false, // Hilangkan teks label
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home-sharp' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="newnote"
        options={{
          title: 'Jejak Baru',
          tabBarIcon: ({ focused }) => {
            animateIcon(focused);
            return (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0, // Mengangkat ikon dari tab bar
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 5,
                }}
              >
                <Animated.View
                  style={{
                    transform: [{ scale: scaleAnim }],
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: focused ? '#052844' : 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: focused ? 0 : 1,
                    borderColor: '#052844',
                  }}
                >
                  <Text
                    style={{
                      color: focused ? 'white' : '#052844',
                      fontSize: 30,
                    }}
                  >
                    +
                  </Text>
                </Animated.View>
              </View>
            );
          },
          tabBarItemStyle: {
            height: 0, // Hilangkan ruang untuk tab tengah agar sesuai dengan desain
          },
        }}
      />
      <Tabs.Screen
        name="konfigurasi"
        options={{
          title: 'Konfigurasi Jejak Laut',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}