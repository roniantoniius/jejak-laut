import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export default function RootLayout() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Montserrat': require('../assets/fonts/MontserratRegular.ttf'),
        'Montserrat-Bold': require('../assets/fonts/MontserratBold.ttf'),
        'Montserrat-SemiBold': require('../assets/fonts/MontserratSemiBold.ttf'),
        'Montserrat-Medium': require('../assets/fonts/MontserratMedium.ttf'),
      });
      setFontLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontLoaded) return null;  // or show a splash screen

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style='light' />
    </>
  );
}