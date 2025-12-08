import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BooksScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-blue-700 pt-8 pb-12 px-6 rounded-b-3xl">
          <Text className="text-white text-4xl font-poppins-bold mb-2">
            📚 Catálogo de Libros
          </Text>
          <Text className="text-blue-100 text-base font-montserrat">
            Explora nuestra colección universitaria
          </Text>
        </View>

        {/* Contenido */}
        <View className="px-6 py-8">
          <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <Text className="text-6xl text-center mb-4">📖</Text>
            <Text className="text-2xl font-poppins-bold text-gray-800 text-center mb-3">
              Próximamente
            </Text>
            <Text className="text-base font-montserrat text-gray-600 text-center mb-4">
              Esta pantalla será desarrollada por tu compañero.
            </Text>
            <View className="bg-blue-50 p-4 rounded-xl mt-4">
              <Text className="text-sm font-montserrat text-blue-700 text-center">
                ✅ Navegación funcionando correctamente
              </Text>
            </View>
          </View>

          {/* Info adicional */}
          <View className="bg-blue-100 rounded-2xl p-6 mt-6">
            <Text className="text-base font-poppins-bold text-gray-800 mb-2">
              Funcionalidades planificadas:
            </Text>
            <Text className="text-sm font-montserrat text-gray-700 mb-1">
              • Catálogo completo de libros
            </Text>
            <Text className="text-sm font-montserrat text-gray-700 mb-1">
              • Búsqueda y filtros
            </Text>
            <Text className="text-sm font-montserrat text-gray-700 mb-1">
              • Vista detallada de cada libro
            </Text>
            <Text className="text-sm font-montserrat text-gray-700">
              • Integración con API
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BooksScreen;