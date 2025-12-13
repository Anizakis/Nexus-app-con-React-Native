import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HapticButton from '../components/HapticButton';

const CoWorkingScreen = () => {
  const [bookingLoading, setBookingLoading] = useState(null);
  
  const spaces = [
    {
      id: 1,
      name: "Zona Silenciosa",
      emoji: "🤫",
      capacity: 24,
      description: "Escritorios individuales con iluminación natural",
      features: ["Escritorios individuales", "Iluminación natural", "Enchufes individuales", "WiFi de alta velocidad"],
      price: 3,
      available: true,
      type: "Individual"
    },
    {
      id: 2,
      name: "Sala Colaborativa",
      emoji: "👥",
      capacity: 16,
      description: "Mesas compartidas con pizarra digital",
      features: ["Mesas compartidas", "Pizarra digital", "Proyector", "Café gratuito"],
      price: 5,
      available: true,
      type: "Grupal"
    },
    {
      id: 3,
      name: "Sala de Reuniones",
      emoji: "📊",
      capacity: 8,
      description: "Mesa de reuniones con equipamiento completo",
      features: ["Mesa de reuniones", "TV 55'", "Videoconferencia", "Pizarra"],
      price: 15,
      available: false,
      type: "Sala de Reuniones"
    }
  ];

  const handleBooking = (space) => {
    if (!space.available) return;

    setBookingLoading(space.id);

    setTimeout(() => {
      Alert.alert(
        '¡Reserva Exitosa!',
        `Has reservado ${space.name} por 1 hora.`,
        [{ text: 'OK' }]
      );
      setBookingLoading(null);
    }, 1000);
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="bg-purple-700 pt-8 pb-12 px-6 rounded-b-3xl">
          <Text className="text-white text-4xl font-poppins-bold mb-2">
            💼 Espacios Co-Working
          </Text>
          <Text className="text-purple-100 text-base font-montserrat">
            Reserva tu espacio de trabajo ideal
          </Text>
        </View>

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

        <View className="px-6 pb-8">
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
                          <View className="w-20 h-20 bg-purple-50 rounded-xl items-center justify-center mr-4">
                            <Text className="text-3xl">{space.emoji}</Text>
                          </View>

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
        </View>

        {/* Content based on active tab */}
        {activeTab === 'list' && (
          <View className="px-6 pb-8">
            {loading ? (
              <View className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-16 shadow-xl items-center justify-center">
                <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
                  <Text className="text-3xl">⏳</Text>
                </View>
                <Text className="text-xl font-poppins-bold text-purple-800 text-center mb-2">
                  Cargando espacios
                </Text>
                <Text className="text-sm font-montserrat text-purple-600 text-center">
                  Buscando los mejores espacios para ti...
                </Text>
              </View>
            ) : (
              <View className="space-y-6">
                {/* Header con estadísticas */}
                <View className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 shadow-xl">
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                      <Text className="text-2xl font-poppins-bold text-white mb-1">
                        📋 Espacios Disponibles
                      </Text>
                      <Text className="text-purple-100 text-sm font-montserrat">
                        Encuentra el espacio perfecto para trabajar
                      </Text>
                    </View>
                    <View className="bg-white bg-opacity-20 rounded-2xl px-4 py-2">
                      <Text className="text-white font-poppins-bold text-lg">
                        {getFilteredSpaces().filter(space => space.available).length}
                      </Text>
                      <Text className="text-purple-100 text-xs font-montserrat text-center">
                        Disponibles
                      </Text>
                    </View>
                  </View>

                  {/* Estadísticas rápidas */}
                  <View className="flex-row justify-between bg-white bg-opacity-10 rounded-2xl p-4">
                    <View className="items-center flex-1">
                      <Text className="text-xl font-poppins-bold text-white">
                        {displaySpaces.filter(s => s.available).length}
                      </Text>
                      <Text className="text-xs font-montserrat text-purple-100">Libres</Text>
                    </View>
                    <View className="items-center flex-1 border-l border-r border-white border-opacity-20">
                      <Text className="text-xl font-poppins-bold text-white">
                        {displaySpaces.filter(s => !s.available).length}
                      </Text>
                      <Text className="text-xs font-montserrat text-purple-100">Ocupados</Text>
                    </View>
                    <View className="items-center flex-1">
                      <Text className="text-xl font-poppins-bold text-white">
                        ${Math.min(...displaySpaces.map(s => s.pricePerHour))}
                      </Text>
                      <Text className="text-xs font-montserrat text-purple-100">Precio mín.</Text>
                    </View>
                  </View>
                </View>

                {/* Filtros mejorados */}
                <View className="bg-white rounded-2xl p-4 shadow-lg">
                  <Text className="text-lg font-poppins-bold text-gray-800 mb-3">
                    🔍 Filtrar por tipo
                  </Text>
                  <View className="flex-row flex-wrap">
                    <TouchableOpacity
                      className={`px-4 py-3 rounded-2xl mr-3 mb-2 border-2 ${
                        activeFilter === 'Todos'
                          ? 'bg-purple-600 border-purple-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      onPress={() => setActiveFilter('Todos')}
                    >
                      <Text className={`font-poppins-bold ${
                        activeFilter === 'Todos' ? 'text-white' : 'text-gray-700'
                      }`}>
                        📋 Todos
                      </Text>
                    </TouchableOpacity>
                    {spaceTypes.filter(type => getSpacesByType(type).length > 0).map(type => (
                      <TouchableOpacity
                        key={type}
                        className={`px-4 py-3 rounded-2xl mr-3 mb-2 border-2 ${
                          activeFilter === type
                            ? 'bg-purple-600 border-purple-600'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                        onPress={() => setActiveFilter(type)}
                      >
                        <Text className={`font-poppins-bold ${
                          activeFilter === type ? 'text-white' : 'text-gray-700'
                        }`}>
                          {type === 'Individual' && '👤'}
                          {type === 'Grupal' && '👥'}
                          {type === 'Compartido' && '🎨'}
                          {type === 'Privada' && '🏢'}
                          {type === 'VIP' && '👑'}
                          {type === 'Exterior' && '🌞'}
                          {' ' + type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Lista de espacios con mejor diseño */}
                <View className="space-y-4">
                  {getFilteredSpaces()
                    .sort((a, b) => {
                      // Disponibles primero, luego por precio
                      if (a.available !== b.available) return b.available - a.available;
                      return a.pricePerHour - b.pricePerHour;
                    })
                    .map(space => renderSpaceCard(space))}
                </View>

                {/* Mensaje si no hay espacios con el filtro */}
                {getFilteredSpaces().length === 0 && (
                  <View className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-lg items-center">
                    <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center mb-4">
                      <Text className="text-3xl">🔍</Text>
                    </View>
                    <Text className="text-xl font-poppins-bold text-gray-700 text-center mb-2">
                      No hay espacios disponibles
                    </Text>
                    <Text className="text-sm font-montserrat text-gray-500 text-center mb-4">
                      No se encontraron espacios para el filtro "{activeFilter}"
                    </Text>
                    <TouchableOpacity
                      className="bg-purple-600 rounded-2xl py-3 px-6"
                      onPress={() => setActiveFilter('Todos')}
                    >
                      <Text className="text-white font-poppins-bold">Ver todos los espacios</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {activeTab === 'floors' && renderFloorsView()}
        {activeTab === 'calendar' && renderCalendarView()}
      </ScrollView>

      {/* Modal de Reserva */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-4/5">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-poppins-bold text-gray-800">
                Reservar Espacio
              </Text>
              <HapticButton
                title="✕"
                onPress={() => setShowBookingModal(false)}
                className="bg-gray-200 w-10 h-10 rounded-full"
                textClassName="text-gray-600"
              />
            </View>

            {selectedSpace && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="bg-purple-50 rounded-xl p-4 mb-6">
                  <Text className="text-lg font-poppins-bold text-gray-800 mb-2">
                    {selectedSpace.emoji} {selectedSpace.name}
                  </Text>
                  <Text className="text-sm font-montserrat text-gray-600 mb-2">
                    {selectedSpace.description}
                  </Text>
                  <Text className="text-sm font-montserrat text-purple-700">
                    Precio: ${selectedSpace.pricePerHour}/hora • ${selectedSpace.pricePerDay}/día
                  </Text>
                </View>

                {/* Formulario de reserva */}
                <View className="space-y-4">
                  <View>
                    <Text className="text-base font-poppins-bold text-gray-700 mb-2">
                      Duración
                    </Text>
                    <View className="flex-row space-x-2">
                      <View className="flex-1">
                        <Text className="text-sm font-montserrat text-gray-600 mb-1">Cantidad</Text>
                        <TextInput
                          className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                          value={values.duration}
                          onChangeText={(value) => handleChange('duration', value)}
                          keyboardType="numeric"
                          placeholder="1"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-montserrat text-gray-600 mb-1">Tipo</Text>
                        <View className="flex-row border border-gray-300 rounded-lg">
                          <TouchableOpacity
                            className={`flex-1 px-3 py-2 rounded-l-lg ${values.durationType === 'hour' ? 'bg-purple-600' : 'bg-white'}`}
                            onPress={() => handleChange('durationType', 'hour')}
                          >
                            <Text className={`text-center text-sm ${values.durationType === 'hour' ? 'text-white' : 'text-gray-700'}`}>
                              Horas
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className={`flex-1 px-3 py-2 rounded-r-lg ${values.durationType === 'day' ? 'bg-purple-600' : 'bg-white'}`}
                            onPress={() => handleChange('durationType', 'day')}
                          >
                            <Text className={`text-center text-sm ${values.durationType === 'day' ? 'text-white' : 'text-gray-700'}`}>
                              Días
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View>
                    <Text className="text-base font-poppins-bold text-gray-700 mb-2">
                      Fecha y Hora
                    </Text>
                    <View className="flex-row space-x-2">
                      <View className="flex-1">
                        <Text className="text-sm font-montserrat text-gray-600 mb-1">Fecha</Text>
                        <TextInput
                          className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                          value={values.date}
                          onChangeText={(value) => handleChange('date', value)}
                          placeholder="YYYY-MM-DD"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-montserrat text-gray-600 mb-1">Hora</Text>
                        <TextInput
                          className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                          value={values.time}
                          onChangeText={(value) => handleChange('time', value)}
                          placeholder="HH:MM"
                        />
                      </View>
                    </View>
                  </View>

                  <View>
                    <Text className="text-base font-poppins-bold text-gray-700 mb-2">
                      Propósito (opcional)
                    </Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-3 py-2 text-base"
                      value={values.purpose}
                      onChangeText={(value) => handleChange('purpose', value)}
                      placeholder="Reunión, trabajo individual, etc."
                      multiline
                      numberOfLines={2}
                    />
                  </View>

                  <View className="bg-gray-50 rounded-xl p-4 mt-4">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-base font-montserrat text-gray-700">
                        Precio por {values.durationType === 'hour' ? 'hora' : 'día'}:
                      </Text>
                      <Text className="text-base font-montserrat text-gray-700">
                        ${values.durationType === 'hour' ? selectedSpace.pricePerHour : selectedSpace.pricePerDay}
                      </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-lg font-poppins-bold text-gray-800">
                        Total a pagar:
                      </Text>
                      <Text className="text-2xl font-poppins-bold text-purple-600">
                        ${calculatePrice(selectedSpace, values.duration || 1, values.durationType)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row space-x-3 mt-6">
                    <View className="flex-1">
                      <HapticButton
                        title="Cancelar"
                        onPress={() => setShowBookingModal(false)}
                        className="bg-gray-200"
                        textClassName="text-gray-700"
                      />
                    </View>
                    <View className="flex-1">
                      <HapticButton
                        title="Confirmar Reserva"
                        onPress={submitBooking}
                        className="bg-purple-600"
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CoWorkingScreen;