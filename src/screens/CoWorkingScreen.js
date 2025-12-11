import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, Alert, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi, useForm } from '../hooks/useApi';
import { fetchCoWorkingSpaces, bookCoWorkingSpace } from '../services/api';
import HapticButton from '../components/HapticButton';
import { coWorkingSpacesData } from '../constants/coWorkingSpaces';

const { width, height } = Dimensions.get('window');

const CoWorkingScreen = () => {
  const { data: spaces, loading, error, refetch } = useApi(fetchCoWorkingSpaces);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'floors', 'calendar'
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Use hardcoded data if API fails
  const displaySpaces = spaces || coWorkingSpacesData;

  const { values, handleChange, resetForm } = useForm({
    duration: '1',
    durationType: 'hour',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    purpose: ''
  });

  const handleBookSpace = async (space) => {
    setSelectedSpace(space);
    setShowBookingModal(true);
  };

  const submitBooking = async () => {
    if (!selectedSpace) return;

    // Basic validation
    if (!values.duration || parseInt(values.duration) <= 0) {
      Alert.alert('Error', 'Por favor ingresa una duración válida.');
      return;
    }

    if (!values.date || !values.time) {
      Alert.alert('Error', 'Por favor selecciona fecha y hora.');
      return;
    }

    try {
      const bookingData = {
        spaceId: selectedSpace.id,
        spaceName: selectedSpace.name,
        duration: parseInt(values.duration),
        durationType: values.durationType,
        date: values.date,
        time: values.time,
        purpose: values.purpose || 'Trabajo general',
        totalPrice: parseFloat(calculatePrice(selectedSpace, values.duration, values.durationType))
      };

      // Use the API to book the space
      await bookCoWorkingSpace(bookingData);

      Alert.alert(
        '🎉 Reserva Confirmada',
        `Has reservado "${selectedSpace.name}" por ${values.duration} ${values.durationType === 'hour' ? 'hora(s)' : 'día(s)'}\n\nFecha: ${values.date}\nHora: ${values.time}\nTotal: $${bookingData.totalPrice}`,
        [{ text: 'OK' }]
      );

      setShowBookingModal(false);
      resetForm();
      setSelectedSpace(null);

    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'No se pudo realizar la reserva. Intenta nuevamente.');
    }
  };

  const calculatePrice = (space, duration, durationType) => {
    const hours = durationType === 'day' ? duration * 8 : duration;
    return (space.pricePerHour * hours).toFixed(2);
  };

  const getSpacesByType = (type) => {
    return displaySpaces.filter(space => space.type === type);
  };

  const getFilteredSpaces = () => {
    return displaySpaces.filter(space => activeFilter === 'Todos' || space.type === activeFilter);
  };

  // Floor data - which spaces are on which floor
  const floorSpaces = {
    1: [1, 2, 6, 3, 8], // Planta 1: Executive, Express, Brainstorming, Tech Meeting, Terrace
    2: [4, 7], // Planta 2: Startup Office, VIP Suite
    3: [5] // Planta 3: Creative Shared Space
  };

  const getSpacesForFloor = (floor) => {
    return displaySpaces.filter(space => floorSpaces[floor]?.includes(space.id));
  };

  const getAvailableSpacesForDate = (date) => {
    // Mock availability logic - in real app this would come from API
    return displaySpaces.filter(space => {
      // Simulate some spaces being booked on certain dates
      const bookedDates = ['2024-12-15', '2024-12-16', '2024-12-20'];
      return space.available && !bookedDates.includes(date);
    });
  };

  const spaceTypes = ['Individual', 'Grupal', 'Compartido', 'Privada', 'VIP', 'Exterior'];

  const renderSpaceCard = (space) => (
    <TouchableOpacity
      key={space.id}
      className={`bg-white rounded-3xl p-6 mb-6 shadow-xl border-2 ${
        space.available ? 'border-purple-100 shadow-purple-100/50' : 'border-gray-200 opacity-75'
      }`}
      onPress={() => space.available && handleBookSpace(space)}
      activeOpacity={space.available ? 0.8 : 1}
    >
      {/* Header con emoji y estado */}
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center">
          <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${
            space.available ? 'bg-purple-100' : 'bg-gray-100'
          }`}>
            <Text className="text-2xl">{space.emoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-poppins-bold text-gray-900 mb-1">
              {space.name}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-sm font-montserrat text-gray-500 mr-2">
                {space.type}
              </Text>
              <View className={`px-2 py-1 rounded-full ${space.available ? 'bg-green-100' : 'bg-red-100'}`}>
                <Text className={`text-xs font-montserrat font-medium ${space.available ? 'text-green-700' : 'text-red-700'}`}>
                  {space.available ? 'Disponible' : 'Ocupado'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Descripción */}
      <Text className="text-sm font-montserrat text-gray-600 mb-4 leading-5">
        {space.description}
      </Text>

      {/* Características */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="flex-row items-center mr-4">
            <Text className="text-sm mr-1">👥</Text>
            <Text className="text-sm font-montserrat text-gray-700">
              {space.capacity} {space.capacity === 1 ? 'persona' : 'personas'}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm mr-1">⭐</Text>
            <Text className="text-sm font-montserrat text-gray-700">
              {space.rating} ({space.reviews})
            </Text>
          </View>
        </View>
      </View>

      {/* Amenities */}
      {space.amenities && space.amenities.length > 0 && (
        <View className="flex-row flex-wrap mb-4">
          {space.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} className="bg-gray-100 rounded-lg px-2 py-1 mr-2 mb-2">
              <Text className="text-xs font-montserrat text-gray-600">{amenity}</Text>
            </View>
          ))}
          {space.amenities.length > 3 && (
            <View className="bg-gray-100 rounded-lg px-2 py-1">
              <Text className="text-xs font-montserrat text-gray-600">+{space.amenities.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      {/* Precios y botón */}
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <View className="flex-row items-baseline mb-1">
            <Text className="text-lg font-poppins-bold text-purple-600 mr-2">
              ${space.pricePerHour}
            </Text>
            <Text className="text-sm font-montserrat text-gray-500">/hora</Text>
          </View>
          <Text className="text-sm font-montserrat text-gray-500">
            ${space.pricePerDay}/día completo
          </Text>
        </View>
        <HapticButton
          title={space.available ? "Reservar Ahora" : "No Disponible"}
          onPress={() => handleBookSpace(space)}
          className={space.available ? "bg-purple-600 px-6 py-3" : "bg-gray-300 px-6 py-3"}
          disabled={!space.available}
          textClassName="text-sm font-medium"
        />
      </View>

      {/* Indicador de acción */}
      {space.available && (
        <View className="absolute top-4 right-4 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></View>
      )}
    </TouchableOpacity>
  );

  const renderFloorsView = () => {
    const floors = [1, 2, 3];
    const floorSpaces = getSpacesForFloor(selectedFloor);

    return (
      <View className="bg-gray-100 rounded-2xl p-4 mx-6 mb-6" style={{ height: height * 0.8 }}>
        <Text className="text-xl font-poppins-bold text-gray-800 mb-4 text-center">
          🏢 Plantas del Edificio
        </Text>

        {/* Floor Selector */}
        <View className="flex-row bg-white rounded-xl p-2 mb-6 shadow-md">
          {floors.map(floor => (
            <TouchableOpacity
              key={floor}
              className={`flex-1 py-3 px-4 rounded-lg mx-1 ${
                selectedFloor === floor ? 'bg-purple-600' : 'bg-gray-100'
              }`}
              onPress={() => setSelectedFloor(floor)}
            >
              <Text className={`text-center font-poppins-bold ${
                selectedFloor === floor ? 'text-white' : 'text-gray-700'
              }`}>
                Planta {floor}
              </Text>
              <Text className={`text-xs text-center mt-1 ${
                selectedFloor === floor ? 'text-purple-100' : 'text-gray-500'
              }`}>
                {getSpacesForFloor(floor).length} salas
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Floor Info */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-md">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-poppins-bold text-gray-800">
              Planta {selectedFloor}
            </Text>
            <View className="bg-purple-100 px-3 py-1 rounded-full">
              <Text className="text-sm font-montserrat text-purple-700">
                {floorSpaces.filter(s => s.available).length} disponibles
              </Text>
            </View>
          </View>

          {/* Floor Description */}
          <Text className="text-sm font-montserrat text-gray-600 mb-4">
            {selectedFloor === 1 && "Planta baja con recepción y espacios premium individuales y grupales."}
            {selectedFloor === 2 && "Planta ejecutiva con oficinas privadas y suites VIP."}
            {selectedFloor === 3 && "Planta creativa con espacios compartidos y áreas de trabajo colaborativo."}
          </Text>

          {/* Quick Stats for this floor */}
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-lg font-poppins-bold text-green-600">
                {floorSpaces.filter(s => s.available).length}
              </Text>
              <Text className="text-xs font-montserrat text-gray-600">Disponibles</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-poppins-bold text-gray-600">
                {floorSpaces.filter(s => !s.available).length}
              </Text>
              <Text className="text-xs font-montserrat text-gray-600">Ocupados</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-poppins-bold text-purple-600">
                {floorSpaces.length > 0 ? `$${Math.min(...floorSpaces.map(s => s.pricePerHour))}` : '$0'}
              </Text>
              <Text className="text-xs font-montserrat text-gray-600">Precio mín.</Text>
            </View>
          </View>
        </View>

        {/* Spaces for selected floor */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="space-y-4">
            {floorSpaces.length > 0 ? (
              floorSpaces
                .sort((a, b) => {
                  // Disponibles primero, luego por precio
                  if (a.available !== b.available) return b.available - a.available;
                  return a.pricePerHour - b.pricePerHour;
                })
                .map(space => renderSpaceCard(space))
            ) : (
              <View className="bg-white rounded-3xl p-8 items-center shadow-md">
                <Text className="text-4xl mb-4">🏗️</Text>
                <Text className="text-lg font-poppins-bold text-gray-700 text-center mb-2">
                  Planta en construcción
                </Text>
                <Text className="text-sm font-montserrat text-gray-500 text-center">
                  Esta planta aún no tiene espacios disponibles.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="flex-row mt-4 space-x-3">
          <TouchableOpacity
            className="flex-1 bg-purple-600 rounded-xl py-3"
            onPress={() => setActiveTab('list')}
          >
            <Text className="text-white font-poppins-bold text-center">Ver Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-gray-200 rounded-xl py-3"
            onPress={() => setActiveTab('calendar')}
          >
            <Text className="text-gray-700 font-poppins-bold text-center">Disponibilidad</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const renderCalendarView = () => {
    const currentDate = new Date();
    const selectedMonth = calendarDate.getMonth();
    const selectedYear = calendarDate.getFullYear();

    // Generate calendar grid (6 weeks x 7 days = 42 cells)
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const calendarDays = [];
    const currentCalendarDate = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dayInfo = {
          date: new Date(currentCalendarDate),
          dayNumber: currentCalendarDate.getDate(),
          isCurrentMonth: currentCalendarDate.getMonth() === selectedMonth,
          isToday: currentCalendarDate.toDateString() === currentDate.toDateString(),
          isPast: currentCalendarDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
          isSelected: selectedDate && currentCalendarDate.toDateString() === selectedDate.toDateString()
        };
        weekDays.push(dayInfo);
        currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
      }
      calendarDays.push(weekDays);
    }

    const availableSpacesForDate = (date) => {
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return getAvailableSpacesForDate(dateString).length;
    };

    const navigateMonth = (direction) => {
      const newDate = new Date(calendarDate);
      newDate.setMonth(newDate.getMonth() + direction);
      setCalendarDate(newDate);
      setSelectedDate(null); // Clear selection when changing months
    };

    const handleDayPress = (dayInfo) => {
      if (dayInfo.isPast) return;

      setSelectedDate(dayInfo.date);
      const availableCount = availableSpacesForDate(dayInfo.date);

      Alert.alert(
        `Disponibilidad ${dayInfo.dayNumber}/${selectedMonth + 1}/${selectedYear}`,
        availableCount > 0
          ? `🎉 ${availableCount} espacios disponibles\n\n¿Quieres ver los espacios disponibles para este día?`
          : '❌ No hay espacios disponibles este día',
        [
          { text: 'Cancelar' },
          availableCount > 0 ? {
            text: 'Ver Espacios',
            onPress: () => setActiveTab('list')
          } : null
        ].filter(Boolean)
      );
    };

    return (
      <View className="bg-gray-50 p-4 mx-6 mb-6">
        {/* Calendar Container - Google Calendar Style */}
        <View className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <View className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full items-center justify-center"
                onPress={() => navigateMonth(-1)}
              >
                <Text className="text-white text-xl font-bold">‹</Text>
              </TouchableOpacity>

              <View className="flex-1 mx-4">
                <Text className="text-2xl font-poppins-bold text-white text-center">
                  {new Date(selectedYear, selectedMonth).toLocaleDateString('es-ES', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
              </View>

              <TouchableOpacity
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full items-center justify-center"
                onPress={() => navigateMonth(1)}
              >
                <Text className="text-white text-xl font-bold">›</Text>
              </TouchableOpacity>
            </View>

            {/* Today Button */}
            <TouchableOpacity
              className="bg-white bg-opacity-20 rounded-xl py-2 px-4 self-center"
              onPress={() => {
                setCalendarDate(new Date());
                setSelectedDate(null);
              }}
            >
              <Text className="text-white font-poppins-bold text-sm">Hoy</Text>
            </TouchableOpacity>
          </View>

          {/* Days of Week Header */}
          <View className="flex-row bg-gray-50 border-b border-gray-200">
            {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((day, index) => (
              <View key={day} className="flex-1 p-3 items-center">
                <Text className={`text-sm font-poppins-bold ${
                  index === 0 ? 'text-red-600' :
                  index === 6 ? 'text-blue-600' :
                  'text-gray-700'
                }`}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View className="bg-white">
            {calendarDays.map((week, weekIndex) => (
              <View key={weekIndex} className="flex-row border-b border-gray-100 last:border-b-0">
                {week.map((dayInfo, dayIndex) => {
                  const availability = availableSpacesForDate(dayInfo.date);
                  const hasAvailability = availability > 0;

                  return (
                    <TouchableOpacity
                      key={dayIndex}
                      className={`flex-1 aspect-square p-2 items-center justify-start border-r border-gray-100 last:border-r-0 ${
                        dayInfo.isSelected
                          ? 'bg-purple-100 border-purple-300'
                          : dayInfo.isToday
                          ? 'bg-blue-50 border-blue-300'
                          : !dayInfo.isCurrentMonth
                          ? 'bg-gray-50'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onPress={() => handleDayPress(dayInfo)}
                      disabled={dayInfo.isPast}
                    >
                      <View className="w-full h-full items-center justify-start">
                        {/* Day Number */}
                        <Text className={`text-base font-poppins-bold mb-1 ${
                          dayInfo.isPast
                            ? 'text-gray-400'
                            : !dayInfo.isCurrentMonth
                            ? 'text-gray-500'
                            : dayInfo.isToday
                            ? 'text-blue-600'
                            : dayInfo.isSelected
                            ? 'text-purple-600'
                            : 'text-gray-900'
                        }`}>
                          {dayInfo.dayNumber}
                        </Text>

                        {/* Availability Indicator */}
                        {dayInfo.isCurrentMonth && !dayInfo.isPast && (
                          <View className="flex-row items-center">
                            {hasAvailability ? (
                              <View className="w-2 h-2 bg-green-500 rounded-full mr-1"></View>
                            ) : (
                              <View className="w-2 h-2 bg-red-400 rounded-full mr-1"></View>
                            )}
                            <Text className={`text-xs font-montserrat ${
                              hasAvailability ? 'text-green-600' : 'text-red-500'
                            }`}>
                              {availability}
                            </Text>
                          </View>
                        )}

                        {/* Today Indicator */}
                        {dayInfo.isToday && (
                          <View className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></View>
                        )}

                        {/* Selected Indicator */}
                        {dayInfo.isSelected && (
                          <View className="absolute inset-0 border-2 border-purple-500 rounded-lg"></View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Footer with Quick Actions */}
          <View className="p-4 bg-gray-50 border-t border-gray-200">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-2"></View>
                <Text className="text-xs font-montserrat text-gray-600 mr-4">Disponible</Text>
                <View className="w-3 h-3 bg-red-400 rounded-full mr-2"></View>
                <Text className="text-xs font-montserrat text-gray-600">Ocupado</Text>
              </View>

              <View className="flex-row">
                <TouchableOpacity
                  className="bg-purple-600 rounded-lg py-2 px-4 mr-2"
                  onPress={() => setActiveTab('list')}
                >
                  <Text className="text-white text-sm font-poppins-bold">Ver Espacios</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-indigo-600 rounded-lg py-2 px-4"
                  onPress={() => setActiveTab('floors')}
                >
                  <Text className="text-white text-sm font-poppins-bold">Ver Plantas</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Selected Date Details */}
        {selectedDate && (
          <View className="mt-4 bg-white rounded-2xl p-4 shadow-lg">
            <Text className="text-lg font-poppins-bold text-gray-800 mb-2">
              📅 {selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Text className="text-sm font-montserrat text-gray-600">
              {availableSpacesForDate(selectedDate)} espacios disponibles
            </Text>
          </View>
        )}
      </View>
    );
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

        {/* Tab Navigation */}
        <View className="flex-row mx-6 mt-6 mb-4 bg-white rounded-2xl p-2 shadow-md">
          <TouchableOpacity
            className={`flex-1 py-3 px-4 rounded-xl ${activeTab === 'list' ? 'bg-purple-600' : 'bg-transparent'}`}
            onPress={() => setActiveTab('list')}
          >
            <Text className={`text-center font-poppins-bold ${activeTab === 'list' ? 'text-white' : 'text-gray-700'}`}>
              📋 Lista
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 px-4 rounded-xl ${activeTab === 'floors' ? 'bg-purple-600' : 'bg-transparent'}`}
            onPress={() => setActiveTab('floors')}
          >
            <Text className={`text-center font-poppins-bold ${activeTab === 'floors' ? 'text-white' : 'text-gray-700'}`}>
              🏢 Plantas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 px-4 rounded-xl ${activeTab === 'calendar' ? 'bg-purple-600' : 'bg-transparent'}`}
            onPress={() => setActiveTab('calendar')}
          >
            <Text className={`text-center font-poppins-bold ${activeTab === 'calendar' ? 'text-white' : 'text-gray-700'}`}>
              📅 Calendario
            </Text>
          </TouchableOpacity>
        </View>

        {/* Banner de disponibilidad */}
        <View className="mx-6 mb-4">
          <View className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-3xl mr-3">📅</Text>
              <Text className="text-white text-xl font-poppins-bold">
                ¡Reserva Ahora!
              </Text>
            </View>
            <Text className="text-purple-100 text-base font-montserrat mb-3">
              Espacios disponibles desde $3.50/hora
            </Text>
            <View className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
              <Text className="text-white text-sm font-montserrat text-center">
                ⏰ Disponible 24/7 • Reserva instantánea
              </Text>
            </View>
          </View>
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