import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../hooks/useApi';
import { fetchCoWorkingSpaces, bookCoWorkingSpace } from '../services/api';
import HapticButton from '../components/HapticButton';

const CoWorkingScreen = () => {
  const { data: spaces, loading, error, refetch } = useApi(fetchCoWorkingSpaces);
  const [bookingLoading, setBookingLoading] = useState(null);

  const handleBooking = async (space) => {
    if (!space.available) return;

    setBookingLoading(space.id);

    try {
      // Aquí puedes agregar lógica para seleccionar fecha/hora
      // Por ahora, reservamos para "ahora"
      const reservationData = {
        spaceId: space.id,
        userId: 'user123', // En una app real, esto vendría del contexto de autenticación
        startTime: new Date().toISOString(),
        duration: 1, // 1 hora por defecto
        totalPrice: space.price
      };

      await bookCoWorkingSpace(reservationData);

      Alert.alert(
        '¡Reserva Exitosa!',
        `Has reservado ${space.name} por 1 hora.`,
        [{ text: 'OK' }]
      );

      // Recargar espacios para actualizar disponibilidad
      refetch();
    } catch (error) {
      Alert.alert(
        'Error en la Reserva',
        'No se pudo completar la reserva. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
      console.error('Error booking space:', error);
    } finally {
      setBookingLoading(null);
    }
  };
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

        {/* Banner promocional */}
        <View className="mx-6 mt-6 mb-4">
          <View className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-3xl mr-3">🚀</Text>
              <Text className="text-white text-xl font-poppins-bold">
                ¡Espacios Premium!
              </Text>
            </View>
            <Text className="text-purple-100 text-base font-montserrat mb-3">
              Reserva tu espacio ideal con descuento del 20%
            </Text>
            <View className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
              <Text className="text-white text-sm font-montserrat text-center">
                💼 Primera hora gratis • Membresía disponible
              </Text>
            </View>
          </View>
        </View>

        {/* Contenido */}
        <View className="px-6 pb-8">
          {loading ? (
            <View className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100 items-center">
              <ActivityIndicator size="large" color="#7C3AED" />
              <Text className="text-gray-600 font-montserrat mt-4 text-center">
                Cargando espacios...
              </Text>
            </View>
          ) : error ? (
            <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <Text className="text-6xl text-center mb-4">⚠️</Text>
              <Text className="text-2xl font-poppins-bold text-gray-800 text-center mb-3">
                Error al cargar espacios
              </Text>
              <Text className="text-base font-montserrat text-gray-600 text-center mb-4">
                {error}
              </Text>
              <HapticButton
                title="Reintentar"
                onPress={refetch}
                className="bg-purple-600"
              />
            </View>
          ) : spaces && spaces.length > 0 ? (
            <>
              {/* Tipos de espacios */}
              {['Individual', 'Grupal', 'Sala de Reuniones'].map(spaceType => {
                const typeSpaces = spaces.filter(space => space.type === spaceType);
                if (typeSpaces.length === 0) return null;

                return (
                  <View key={spaceType} className="mb-8">
                    <Text className="text-xl font-poppins-bold text-gray-800 mb-4">
                      {spaceType}
                    </Text>

                    {typeSpaces.map(space => (
                      <View key={space.id} className="bg-white rounded-2xl p-4 mb-4 shadow-md border border-gray-100">
                        <View className="flex-row">
                          {/* Imagen del espacio */}
                          <View className="w-20 h-20 bg-purple-50 rounded-xl items-center justify-center mr-4">
                            <Text className="text-3xl">{space.emoji}</Text>
                          </View>

                          {/* Información del espacio */}
                          <View className="flex-1">
                            <Text className="text-lg font-poppins-bold text-gray-800 mb-1">
                              {space.name}
                            </Text>
                            <Text className="text-sm font-montserrat text-gray-600 mb-1">
                              Capacidad: {space.capacity} personas
                            </Text>
                            <Text className="text-sm font-montserrat text-gray-600 mb-2">
                              {space.description}
                            </Text>
                            <View className="flex-row justify-between items-center">
                              <View>
                                <Text className="text-xl font-poppins-bold text-purple-600">
                                  ${space.price}/hora
                                </Text>
                                <Text className="text-xs font-montserrat text-gray-500">
                                  {space.available ? 'Disponible' : 'Ocupado'}
                                </Text>
                              </View>
                              <HapticButton
                                title={bookingLoading === space.id ? "Reservando..." : "Reservar"}
                                onPress={() => handleBooking(space)}
                                className={`px-4 py-2 ${space.available ? 'bg-purple-600' : 'bg-gray-400'}`}
                                textClassName="text-sm"
                                hapticType={space.available ? 'medium' : 'light'}
                                disabled={!space.available || bookingLoading === space.id}
                              />
                            </View>
                          </View>
                        </View>

                        {/* Características adicionales */}
                        <View className="flex-row flex-wrap mt-3">
                          {space.features?.map((feature, index) => (
                            <View key={index} className="bg-purple-50 rounded-lg px-2 py-1 mr-2 mb-1">
                              <Text className="text-xs font-montserrat text-purple-700">
                                {feature}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                );
              })}
            </>
          ) : (
            <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <Text className="text-6xl text-center mb-4">🏢</Text>
              <Text className="text-2xl font-poppins-bold text-gray-800 text-center mb-3">
                Espacios no disponibles
              </Text>
              <Text className="text-base font-montserrat text-gray-600 text-center mb-4">
                No se pudieron cargar los espacios de co-working.
              </Text>
              <HapticButton
                title="Reintentar"
                onPress={refetch}
                className="bg-purple-600"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CoWorkingScreen;