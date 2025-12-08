import "./global.css";
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { 
  Poppins_400Regular, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import { 
  Montserrat_400Regular, 
  Montserrat_700Bold 
} from '@expo-google-fonts/montserrat';

import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Poppins_400Regular,
        Poppins_700Bold,
        Montserrat_400Regular,
        Montserrat_700Bold,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // Mientras cargan las fuentes, mostrar indicador
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E40AF' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // Mostrar Splash Screen después de cargar fuentes
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Mostrar la app principal
  return <AppNavigator />;
}
