import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CoWorkingScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-purple-700 pt-8 pb-12 px-6 rounded-b-3xl">
          <Text className="text-white text-4xl font-poppins-bold mb-2">
            💼 Espacios Co-Working
          </Text>
          <Text className="text-purple-100 text-base font-montserrat">
            Reserva tu espacio de trabajo ideal
          </Text>
        </View>

        {/* Contenido */}
        <View className="px-6 py-8">
          <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <Text className="text-6xl text-center mb-4">🪑</Text>
            <Text className="text-2xl font-poppins-bold text-gray-800 text-center mb-3">
              Próximamente
            </Text>
            <Text className="text-base font-montserrat text-gray-600 text-center mb-4">
              Esta pantalla será desarrollada por tu compañero.
            </Text>
            <View className="bg-purple-50 p-4 rounded-xl mt-4">
              <Text className="text-sm font-montserrat text-purple-700 text-center">
                ✅ Navegación funcionando correctamente
              </Text>
            </View>
          </View>

          {/* Info adicional */}
          <View className="bg-purple-100 rounded-2xl p-6 mt-6">
            <Text className="text-base font-poppins-bold text-gray-800 mb-2">
              Funcionalidades planificadas:
            </Text>
            <Text className="text-sm font-montserrat text-gray-700 mb-1">
              • Mapa de espacios disponibles
            </Text>
            <Text className="text-sm font-montserrat text-gray-700 mb-1">
              • Sistema de reservas
            </Text>
            <Text className="text-sm font-montserrat text-gray-700 mb-1">
              • Tipos de espacios (individual, grupal)
            </Text>
            <Text className="text-sm font-montserrat text-gray-700">
              • Calendario de disponibilidad
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CoWorkingScreen;