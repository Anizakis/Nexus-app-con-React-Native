import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importar todas las pantallas
import LandingScreen from '../screens/LandingScreen';
import BooksScreen from '../screens/BooksScreen';
import CoWorkingScreen from '../screens/CoWorkingScreen';
import CafeScreen from '../screens/CafeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
        component={BooksScreen}
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
        component={CafeScreen}
        options={{ tabBarLabel: 'Café' }}
      />
    </Tab.Navigator>
  );
}

// Navegación por Stack (Principal)
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E40AF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        {/* Aquí se pueden agregar más pantallas Stack en el futuro */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
