import React, { useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useApi } from '../hooks/useApi';
import { fetchBookById } from '../services/api';
import { useCart } from '../context/CartContext';

const BookScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  
  const toSpanish = (raw) => {
    if (!raw || typeof raw !== 'object') return null;
    const b = raw.data && typeof raw.data === 'object' ? raw.data : raw;
    return {
      id: b.id ?? b.ID ?? b._id ?? null,
      titulo: b.titulo ?? b.title ?? 'Sin título',
      autor: b.autor ?? b.author ?? 'Autor Desconocido',
      imagen: b.imagen ?? b.image ?? b.cover ?? null,
      categoria: b.categoria ?? b.category ?? 'Sin Categoría',
      precio: b.precio ?? b.price ?? null,
      sinopsis: b.sinopsis ?? b.description ?? b.descripcion ?? 'Descripción no disponible.',
      isbn: b.isbn ?? b.ISBN ?? 'N/A',
      paginas: b.paginas ?? b.pages ?? 'N/A',
      año: b.año ?? b.year ?? b.anio ?? 'N/A',
    };
  };

  const { data: rawBook, loading, error, refetch } = useApi(
    () => fetchBookById(id),
    [id]
  );

  const book = rawBook ? toSpanish(Array.isArray(rawBook) ? rawBook[0] : rawBook) : null;

  const { addItem, count } = useCart();

  const handleAddCart = useCallback(() => {
    if (!book) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addItem(book, 'book');
    Toast.show({
      type: 'success',
      text1: 'Agregado al carrito',
      text2: book.titulo,
      position: 'bottom',
      visibilityTime: 2000,
    });
  }, [book, addItem]);


  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="bg-blue-700 pt-6 pb-8 px-6 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
            >
              <Text className="text-blue-100 text-lg font-montserrat">← Volver</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Cart');
              }}
              className="bg-white/10 rounded-full p-2 relative"
            >
              <Ionicons name="cart" size={24} color="#fff" />
              {count > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-poppins-bold">{count}</Text>
                </View>
              )}
            </Pressable>
          </View>
          <Text className="text-white text-3xl font-poppins-bold">📖 Detalle del Libro</Text>
        </View>

        <View className="px-6 py-8">
          {loading && (
            <View className="items-center justify-center py-12">
              <ActivityIndicator color="#1E40AF" size="large" />
              <Text className="text-gray-600 font-montserrat mt-3">Cargando detalles...</Text>
            </View>
          )}

          {error && (
            <View className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <Text className="text-red-700 font-poppins-bold mb-2">Error</Text>
              <Text className="text-red-600 font-montserrat mb-3">{error}</Text>
              <Pressable
                onPress={refetch}
                className="bg-red-700 py-2 px-4 rounded-lg"
              >
                <Text className="text-white font-montserrat text-center">Reintentar</Text>
              </Pressable>
            </View>
          )}

          {!loading && !error && book && (
            <View className="space-y-6">
              <View className="bg-white rounded-3xl p-4 shadow-xl shadow-black/10 overflow-hidden">
                <Image
                  source={
                    book.imagen 
                      ? { uri: book.imagen }
                      : null
                  }
                  className="w-full aspect-[4/5] bg-gray-200 rounded-2xl"
                  resizeMode="cover"
                />
              </View>

              <View className="bg-white rounded-3xl p-6 shadow-xl shadow-black/10 space-y-4">
                <Text className="text-2xl font-poppins-bold text-gray-900">
                  {book.titulo}
                </Text>
                
                <Text className="text-lg font-montserrat text-gray-600">
                  por <Text className="font-poppins-bold">{book.autor}</Text>
                </Text>

                <View className="bg-blue-50 rounded-2xl p-4 shadow-sm shadow-black/5">
                  <Text className="text-sm font-montserrat text-gray-600 mb-1">Precio</Text>
                  <Text className="text-3xl font-poppins-bold text-green-600">
                    {book.precio != null ? `$${book.precio}` : 'N/A'}
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  <View className="bg-gray-100 rounded-full px-4 py-2">
                    <Text className="text-sm font-montserrat text-gray-700">
                      {book.categoria}
                    </Text>
                  </View>
                  {book.año && book.año !== 'N/A' && (
                    <View className="bg-gray-100 rounded-full px-4 py-2">
                      <Text className="text-sm font-montserrat text-gray-700">Año: {book.año}</Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="bg-white rounded-3xl p-6 shadow-xl shadow-black/10 space-y-3">
                {book.año && book.año !== 'N/A' && (
                  <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                    <Text className="font-poppins-bold text-gray-700">Año de publicación:</Text>
                    <Text className="font-montserrat text-gray-600">{book.año}</Text>
                  </View>
                )}

                {book.isbn && book.isbn !== 'N/A' && (
                  <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
                    <Text className="font-poppins-bold text-gray-700">ISBN:</Text>
                    <Text className="font-montserrat text-gray-600">{book.isbn}</Text>
                  </View>
                )}

                {book.paginas && book.paginas !== 'N/A' && (
                  <View className="flex-row justify-between items-center py-2">
                    <Text className="font-poppins-bold text-gray-700">Páginas:</Text>
                    <Text className="font-montserrat text-gray-600">{book.paginas}</Text>
                  </View>
                )}
              </View>

              <View className="bg-white rounded-3xl p-6 shadow-xl shadow-black/10">
                <Text className="text-lg font-poppins-bold text-gray-900 mb-3">Sinopsis</Text>
                <Text className="font-montserrat text-gray-700 leading-6">
                  {book.sinopsis}
                </Text>
              </View>

              <Pressable
                onPress={handleAddCart}
                className="bg-blue-700 rounded-2xl py-4 px-6 shadow-lg shadow-blue-700/30 active:bg-blue-800"
              >
                <Text className="text-white text-lg font-poppins-bold text-center">
                  🛒 Agregar al carrito
                </Text>
              </Pressable>

              <View className="h-8" />
            </View>
          )}

          {!loading && !error && !book && (
            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <Text className="text-blue-900 font-poppins-bold text-center mb-1">
                No encontrado
              </Text>
              <Text className="text-blue-700 font-montserrat text-center">
                No se pudo cargar la información del libro.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookScreen;