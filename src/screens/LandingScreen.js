import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const LandingScreen = ({ navigation }) => {
  
  const handlePress = (screenName) => {
    // Retroalimentación háptica
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Navegar a la pantalla correspondiente
    switch(screenName) {
      case 'Libros':
        navigation.navigate('Books');
        break;
      case 'CoWorking':
        navigation.navigate('CoWorking');
        break;
      case 'Cafe':
        navigation.navigate('Cafe');
        break;
      default:
        console.log(`Navegando a: ${screenName}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Header con color azul */}
        <View className="bg-blue-700 pt-12 pb-16 px-6 rounded-b-3xl">
          <Text className="text-white text-5xl font-poppins-bold mb-3">
            Nexus
          </Text>
          <Text className="text-blue-100 text-lg font-montserrat mb-4">
            Tu espacio multifuncional
          </Text>
          {/* Tags */}
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-montserrat">📚 Librería</Text>
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-montserrat">💼 Co-Working</Text>
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-montserrat">☕ Cafetería</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 py-8">
          {/* Título de bienvenida */}
          <Text className="text-3xl font-poppins-bold text-gray-800 mb-3">
            ¡Bienvenido! 👋
          </Text>
          <Text className="text-base font-montserrat text-gray-600 mb-8 leading-6">
            Descubre nuestra librería universitaria, trabaja en nuestro espacio 
            de co-working y disfruta de un café mientras estudias o trabajas.
          </Text>

          {/* Card Libros - CON NAVEGACIÓN */}
          <Pressable
            onPress={() => handlePress('Libros')}
            className="bg-white rounded-3xl p-6 mb-4 shadow-lg border border-gray-100 active:opacity-80"
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 w-16 h-16 rounded-2xl items-center justify-center mr-4">
                <Text className="text-4xl">📚</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-poppins-bold text-gray-800 mb-1">
                  Catálogo de Libros
                </Text>
                <Text className="text-sm font-montserrat text-gray-500">
                  Miles de títulos disponibles
                </Text>
              </View>
            </View>
            <View className="bg-blue-50 px-4 py-3 rounded-xl">
              <Text className="text-xs font-montserrat text-blue-700 text-center">
                🎯 Toca para explorar • Con feedback háptico
              </Text>
            </View>
          </Pressable>

          {/* Card Co-Working - CON NAVEGACIÓN */}
          <Pressable
            onPress={() => handlePress('CoWorking')}
            className="bg-white rounded-3xl p-6 mb-4 shadow-lg border border-gray-100 active:opacity-80"
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-purple-100 w-16 h-16 rounded-2xl items-center justify-center mr-4">
                <Text className="text-4xl">💼</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-poppins-bold text-gray-800 mb-1">
                  Espacios de Trabajo
                </Text>
                <Text className="text-sm font-montserrat text-gray-500">
                  Reserva tu lugar ideal
                </Text>
              </View>
            </View>
            <View className="bg-purple-50 px-4 py-3 rounded-xl">
              <Text className="text-xs font-montserrat text-purple-700 text-center">
                💡 Espacios disponibles • Con feedback háptico
              </Text>
            </View>
          </Pressable>

          {/* Card Cafetería - CON NAVEGACIÓN */}
          <Pressable
            onPress={() => handlePress('Cafe')}
            className="bg-white rounded-3xl p-6 mb-4 shadow-lg border border-gray-100 active:opacity-80"
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-amber-100 w-16 h-16 rounded-2xl items-center justify-center mr-4">
                <Text className="text-4xl">☕</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-poppins-bold text-gray-800 mb-1">
                  Cafetería Nexus
                </Text>
                <Text className="text-sm font-montserrat text-gray-500">
                  Menú variado y delicioso
                </Text>
              </View>
            </View>
            <View className="bg-amber-50 px-4 py-3 rounded-xl">
              <Text className="text-xs font-montserrat text-amber-700 text-center">
                ☕ Ver menú completo • Con feedback háptico
              </Text>
            </View>
          </Pressable>

          {/* Información adicional */}
          <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mt-4 border border-blue-100">
            <Text className="text-lg font-poppins-bold text-gray-800 mb-4">
              📍 Información útil
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="bg-white w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Text className="text-xl">🕐</Text>
                </View>
                <Text className="text-sm font-montserrat text-gray-700">
                  Lun - Vie: 8:00 - 22:00
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-white w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Text className="text-xl">🕐</Text>
                </View>
                <Text className="text-sm font-montserrat text-gray-700">
                  Sábados: 10:00 - 20:00
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-white w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Text className="text-xl">📍</Text>
                </View>
                <Text className="text-sm font-montserrat text-gray-700 flex-1">
                  Campus Universitario - Edificio Principal
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="bg-white w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Text className="text-xl">📞</Text>
                </View>
                <Text className="text-sm font-montserrat text-gray-700">
                  +34 900 123 456
                </Text>
              </View>
            </View>
          </View>

        </View>

        {/* Footer */}
        <View className="px-6 pb-8">
          <View className="bg-gray-800 rounded-2xl p-6">
            <Text className="text-white text-center font-montserrat text-sm mb-2">
              ✨ Desarrollado con React Native + Expo
            </Text>
            <Text className="text-gray-400 text-center font-montserrat text-xs">
              Proyecto Nexus © 2024 - UNIR
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;
