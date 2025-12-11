import React from 'react';
import { View, Text, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const CartScreen = ({ navigation }) => {
  const { items, total, removeItem, clear } = useCart();

  const handleRemove = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removeItem(id);
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    clear();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-blue-700 pt-6 pb-8 px-6 rounded-b-3xl mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
          >
            <Text className="text-blue-100 text-lg font-montserrat">← Volver</Text>
          </Pressable>
        </View>
        <Text className="text-white text-3xl font-poppins-bold">🛒 Mi Carrito</Text>
        <Text className="text-blue-100 text-sm font-montserrat mt-1">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <Text className="text-6xl text-center mb-4">🛒</Text>
            <Text className="font-poppins-bold text-xl text-gray-800 text-center mb-2">
              Tu carrito está vacío
            </Text>
            <Text className="font-montserrat text-gray-600 text-center">
              Agrega productos desde el catálogo o cafetería
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white rounded-3xl p-4 mb-3 shadow-xl shadow-black/10 border border-gray-100 flex-row">
            {/* Imagen o emoji del producto */}
            {item.imagen ? (
              <Image
                source={{ uri: item.imagen }}
                className="w-20 h-28 bg-gray-200 rounded-2xl mr-4"
                resizeMode="cover"
              />
            ) : (
              <View className="w-20 h-20 bg-amber-50 rounded-xl items-center justify-center mr-4">
                <Text className="text-3xl">{item.emoji || '📦'}</Text>
              </View>
            )}

            <View className="flex-1">
              <Text className="font-poppins-bold text-base text-gray-900 mb-1" numberOfLines={2}>
                {item.nombre || item.titulo || item.name}
              </Text>
              <Text className="font-montserrat text-sm text-gray-600 mb-2">
                {item.autor || item.category || 'Producto'}
              </Text>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-montserrat text-xs text-gray-500">Cantidad: {item.qty}</Text>
                  <Text className="font-poppins-bold text-lg text-green-600 mt-1">
                    ${((item.precio || 0) * item.qty).toFixed(2)}
                  </Text>
                </View>
                <Pressable
                  onPress={() => handleRemove(item.id)}
                  className="bg-red-50 rounded-full p-2"
                >
                  <Ionicons name="trash-outline" size={20} color="#dc2626" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          items.length > 0 && (
            <View className="mt-4 space-y-4">
              <View className="bg-white rounded-3xl p-6 shadow-xl shadow-black/10 border border-gray-100">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-poppins-bold text-gray-700">Subtotal:</Text>
                  <Text className="text-2xl font-poppins-bold text-gray-900">
                    ${total.toFixed(2)}
                  </Text>
                </View>
                <View className="border-t border-gray-200 pt-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-poppins-bold text-gray-900">Total:</Text>
                    <Text className="text-3xl font-poppins-bold text-green-600">
                      ${total.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                onPress={handleClear}
                className="bg-gray-100 rounded-2xl py-3 px-4 border border-gray-200 active:bg-gray-200"
              >
                <Text className="text-center font-poppins-bold text-gray-700">
                  Vaciar carrito
                </Text>
              </Pressable>

              <Pressable className="bg-blue-700 rounded-2xl py-4 px-6 shadow-lg shadow-blue-700/30 active:bg-blue-800">
                <Text className="text-white text-lg font-poppins-bold text-center">
                  Proceder al pago
                </Text>
              </Pressable>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default CartScreen;
