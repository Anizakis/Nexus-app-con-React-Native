import React from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../hooks/useApi';
import { fetchCafeMenu } from '../services/api';
import HapticButton from '../components/HapticButton';

const CafeScreen = () => {
  const { data: menu, loading, error, refetch } = useApi(fetchCafeMenu);
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-amber-600 pt-8 pb-12 px-6 rounded-b-3xl">
          <Text className="text-white text-4xl font-poppins-bold mb-2">
            ☕ Cafetería Nexus
          </Text>
          <Text className="text-amber-100 text-base font-montserrat">
            Disfruta de nuestro menú variado
          </Text>
        </View>

        {/* Banner de ofertas */}
        <View className="mx-6 mt-6 mb-4">
          <View className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-3xl mr-3">🎉</Text>
              <Text className="text-white text-xl font-poppins-bold">
                ¡Oferta Especial!
              </Text>
            </View>
            <Text className="text-amber-100 text-base font-montserrat mb-3">
              2x1 en cafés premium los miércoles
            </Text>
            <View className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
              <Text className="text-white text-sm font-montserrat text-center">
                ⏰ Solo hoy • Válido hasta las 8:00 PM
              </Text>
            </View>
          </View>
        </View>

        {/* Contenido */}
        <View className="px-6 pb-8">
          {loading ? (
            <View className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100 items-center">
              <ActivityIndicator size="large" color="#F59E0B" />
              <Text className="text-gray-600 font-montserrat mt-4 text-center">
                Cargando menú...
              </Text>
            </View>
          ) : error ? (
            <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <Text className="text-6xl text-center mb-4">⚠️</Text>
              <Text className="text-2xl font-poppins-bold text-gray-800 text-center mb-3">
                Error al cargar el menú
              </Text>
              <Text className="text-base font-montserrat text-gray-600 text-center mb-4">
                {error}
              </Text>
              <HapticButton
                title="Reintentar"
                onPress={refetch}
                className="bg-amber-600"
              />
            </View>
          ) : menu && menu.length > 0 ? (
            <>
              {/* Categorías del menú */}
              {['Bebidas Calientes', 'Bebidas Frías', 'Comidas', 'Postres'].map(category => {
                const categoryItems = menu.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;

                return (
                  <View key={category} className="mb-8">
                    <Text className="text-xl font-poppins-bold text-gray-800 mb-4">
                      {category}
                    </Text>

                    {categoryItems.map(item => (
                      <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-md border border-gray-100">
                        <View className="flex-row">
                          {/* Imagen del producto */}
                          <View className="w-20 h-20 bg-amber-50 rounded-xl items-center justify-center mr-4">
                            <Text className="text-3xl">{item.emoji}</Text>
                          </View>

                          {/* Información del producto */}
                          <View className="flex-1">
                            <Text className="text-lg font-poppins-bold text-gray-800 mb-1">
                              {item.name}
                            </Text>
                            <Text className="text-sm font-montserrat text-gray-600 mb-2">
                              {item.description}
                            </Text>
                            <View className="flex-row justify-between items-center">
                              <Text className="text-xl font-poppins-bold text-amber-600">
                                ${item.price}
                              </Text>
                              <HapticButton
                                title="Agregar"
                                onPress={() => {
                                  // Aquí iría la lógica para agregar al carrito
                                  console.log('Agregar al carrito:', item.name);
                                }}
                                className="bg-amber-600 px-4 py-2"
                                textClassName="text-sm"
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
            </>
          ) : (
            <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <Text className="text-6xl text-center mb-4">🍽️</Text>
              <Text className="text-2xl font-poppins-bold text-gray-800 text-center mb-3">
                Menú no disponible
              </Text>
              <Text className="text-base font-montserrat text-gray-600 text-center mb-4">
                No se pudo cargar el menú en este momento.
              </Text>
              <HapticButton
                title="Reintentar"
                onPress={refetch}
                className="bg-amber-600"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CafeScreen;