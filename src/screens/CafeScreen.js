import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useApi } from '../hooks/useApi';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import HapticButton from '../components/HapticButton';

const CafeScreen = ({ navigation }) => {
  const { data: products, loading, error, refetch } = useApi(fetchProducts);
  const { addItem, count } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map(product => product.category))];
  }, [products]);
  
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleAddToCart = (item) => {
    addItem({
      id: item.id,
      nombre: item.name || item.title,
      precio: item.price,
      category: item.category
    }, 'cafe');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="bg-amber-600 pt-8 pb-12 px-6 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-white text-4xl font-poppins-bold mb-1">
                ☕ Cafetería Nexus
              </Text>
              <Text className="text-amber-100 text-base font-montserrat">
                Disfruta de nuestro menú variado
              </Text>
            </View>
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
        </View>

        <View className="mx-6 mt-6 mb-4">
          <View className="bg-gradient-to-b from-amber-400 to-amber-500 rounded-3xl p-6 shadow-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-3xl mr-3">🎉</Text>
              <Text className="text-amber-900 text-xl font-poppins-bold">
                ¡Oferta Especial!
              </Text>
            </View>
            <Text className="text-amber-800 text-base font-montserrat mb-3">
              2x1 en cafés premium los miércoles
            </Text>
            <View className="bg-white bg-opacity-30 rounded-xl px-4 py-2">
              <Text className="text-amber-900 text-sm font-montserrat text-center font-bold">
                ⏰ Solo hoy • Válido hasta las 8:00 PM
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 mb-4">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="space-x-2"
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === 'all' 
                  ? 'bg-amber-600 border-amber-600' 
                  : 'bg-white border-gray-200'
              } shadow-sm`}
            >
              <Text className={`font-montserrat text-sm ${
                selectedCategory === 'all' ? 'text-white' : 'text-gray-700'
              }`}>
                Todos
              </Text>
            </Pressable>

            {categories.map(category => (
              <Pressable
                key={category}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(category);
                }}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === category 
                    ? 'bg-amber-600 border-amber-600' 
                    : 'bg-white border-gray-200'
                } shadow-sm`}
              >
                <Text className={`font-montserrat text-sm ${
                  selectedCategory === category ? 'text-white' : 'text-gray-700'
                }`}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="px-6 pb-8">
          {loading ? (
            <View className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100 items-center">
              <ActivityIndicator size="large" color="#F59E0B" />
              <Text className="text-gray-600 font-montserrat mt-4 text-center">
                Cargando productos...
              </Text>
            </View>
          ) : error ? (
            <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <Text className="text-6xl text-center mb-4">⚠️</Text>
              <Text className="text-2xl font-poppins-bold text-gray-800 text-center mb-3">
                Error al cargar productos
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
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <>
              {filteredProducts.map(item => (
                <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-md border border-gray-100">
                  <View className="flex-row">
                    {item.image ? (
                      <Image 
                        source={{ uri: item.image }} 
                        className="w-20 h-20 rounded-xl mr-4 bg-gray-200"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-20 h-20 bg-amber-50 rounded-xl items-center justify-center mr-4">
                        <Text className="text-3xl">🍽️</Text>
                      </View>
                    )}

                    <View className="flex-1">
                      <Text className="text-lg font-poppins-bold text-gray-800 mb-1">
                        {item.name || item.title}
                      </Text>
                      <Text className="text-xs font-montserrat text-gray-500 mb-1">
                        {item.category}
                      </Text>
                      <Text className="text-sm font-montserrat text-gray-600 mb-2" numberOfLines={2}>
                        {item.description}
                      </Text>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-xl font-poppins-bold text-amber-600">
                          ${item.price}
                        </Text>
                        <HapticButton
                          title="Agregar"
                          onPress={() => handleAddToCart(item)}
                          className="bg-amber-600 px-4 py-2"
                          textClassName="text-sm"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <Text className="text-6xl text-center mb-4">🍽️</Text>
              <Text className="text-2xl font-poppins-bold text-gray-800 text-center mb-3">
                No hay productos disponibles
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