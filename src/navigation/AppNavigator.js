import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importar todas las pantallas
import LandingScreen from '../screens/LandingScreen';
import CatalogScreen from '../screens/CatalogScreen';
import BookScreen from '../screens/BookScreen';
import CartScreen from '../screens/CartScreen';
import CoWorkingScreen from '../screens/CoWorkingScreen';
import CafeScreen from '../screens/CafeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack de Libros
function BooksStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Catalog" component={CatalogScreen} />
      <Stack.Screen name="BookDetails" component={BookScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}

// Stack de Cafetería
function CafeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CafeMain" component={CafeScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}

// Navegación por Tabs (Bottom Tabs)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Books') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'CoWorking') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Cafe') {
            iconName = focused ? 'cafe' : 'cafe-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      {/* Pestaña 1: Inicio (Landing) */}
      <Tab.Screen 
        name="Home" 
        component={LandingScreen}
        options={{ tabBarLabel: 'Inicio' }}
      />
      
      {/* Pestaña 2: Libros */}
      <Tab.Screen 
        name="Books" 
        component={BooksStack}
        options={{ tabBarLabel: 'Libros' }}
      />
      
      {/* Pestaña 3: Co-Working */}
      <Tab.Screen 
        name="CoWorking" 
        component={CoWorkingScreen}
        options={{ tabBarLabel: 'Co-Working' }}
      />
      
      {/* Pestaña 4: Cafetería */}
      <Tab.Screen
        name="Cafe"
        component={CafeStack}
        options={{ tabBarLabel: 'Café' }}
      />
    </Tab.Navigator>
  );
}


// Navegación por Stack (Principal)
function AppNavigator() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default AppNavigator;
