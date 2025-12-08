import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  // Animaciones principales
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(100)).current;
  
  // Animaciones para círculos de fondo
  const circle1Scale = useRef(new Animated.Value(0)).current;
  const circle2Scale = useRef(new Animated.Value(0)).current;
  const circle3Scale = useRef(new Animated.Value(0)).current;
  
  // Animaciones para los 3 iconos
  const icon1Anim = useRef(new Animated.Value(0)).current;
  const icon2Anim = useRef(new Animated.Value(0)).current;
  const icon3Anim = useRef(new Animated.Value(0)).current;
  
  // Animación de brillo
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Animación de progreso
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Vibración inicial suave
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animación de brillo continuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Secuencia principal de animaciones
    Animated.sequence([
      // 1. Círculos de fondo expandiéndose
      Animated.stagger(200, [
        Animated.spring(circle1Scale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(circle2Scale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(circle3Scale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // 2. Logo principal aparece con rotación
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideUpAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // 3. Pausa
      Animated.delay(300),

      // 4. Iconos aparecen en cascada
      Animated.stagger(150, [
        Animated.parallel([
          Animated.spring(icon1Anim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(icon2Anim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(icon3Anim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),

      // 5. Barra de progreso
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      // 6. Pausa final
      Animated.delay(600),

      // 7. Fade out espectacular
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Vibración de éxito al finalizar
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onFinish();
    });
  }, []);

  const rotate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7],
  });

  return (
    <LinearGradient
      colors={['#1E3A8A', '#1E40AF', '#3B82F6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className="flex-1 items-center justify-center">
        
        {/* Círculos de fondo decorativos */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: 200,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            transform: [{ scale: circle1Scale }],
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: 'rgba(255, 255, 255, 0.07)',
            transform: [{ scale: circle2Scale }],
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transform: [{ scale: circle3Scale }],
          }}
        />

        {/* Contenedor principal del logo */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideUpAnim },
              { rotate: rotate },
            ],
          }}
        >
          {/* Logo con efecto de brillo */}
          <View className="items-center relative">
            {/* Brillo de fondo */}
            <Animated.View
              style={{
                position: 'absolute',
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                opacity: glowOpacity,
              }}
            />
            
            {/* Círculo contenedor del icono */}
            <View className="bg-white/20 w-44 h-44 rounded-full items-center justify-center mb-8 border-4 border-white/30 shadow-2xl">
              <View className="bg-white/30 w-36 h-36 rounded-full items-center justify-center">
                <View className="bg-white/40 w-28 h-28 rounded-full items-center justify-center">
                  <Text className="text-8xl">📚</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Texto principal */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          }}
          className="items-center mb-12"
        >
          <Text className="text-white text-7xl font-poppins-bold mb-3 tracking-widest" style={{ textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10 }}>
            NEXUS
          </Text>
          <View className="bg-white/20 px-6 py-2 rounded-full">
            <Text className="text-blue-50 text-lg font-montserrat tracking-wider">
              Tu Espacio Multifuncional
            </Text>
          </View>
        </Animated.View>

        {/* Tres iconos con animación en cascada */}
        <View className="flex-row space-x-6 mb-16">
          <Animated.View
            style={{
              opacity: icon1Anim,
              transform: [
                { scale: icon1Anim },
                { translateY: icon1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                })},
              ],
            }}
          >
            <View className="bg-white/25 w-20 h-20 rounded-3xl items-center justify-center shadow-xl border-2 border-white/40">
              <Text className="text-4xl">📚</Text>
              <Text className="text-white text-xs font-montserrat mt-1">Librería</Text>
            </View>
          </Animated.View>
          
          <Animated.View
            style={{
              opacity: icon2Anim,
              transform: [
                { scale: icon2Anim },
                { translateY: icon2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                })},
              ],
            }}
          >
            <View className="bg-white/25 w-20 h-20 rounded-3xl items-center justify-center shadow-xl border-2 border-white/40">
              <Text className="text-4xl">💼</Text>
              <Text className="text-white text-xs font-montserrat mt-1">Trabajo</Text>
            </View>
          </Animated.View>
          
          <Animated.View
            style={{
              opacity: icon3Anim,
              transform: [
                { scale: icon3Anim },
                { translateY: icon3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                })},
              ],
            }}
          >
            <View className="bg-white/25 w-20 h-20 rounded-3xl items-center justify-center shadow-xl border-2 border-white/40">
              <Text className="text-4xl">☕</Text>
              <Text className="text-white text-xs font-montserrat mt-1">Café</Text>
            </View>
          </Animated.View>
        </View>

        {/* Barra de progreso elegante */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="absolute bottom-32 items-center"
        >
          <Text className="text-blue-100 text-sm font-montserrat mb-4">
            Preparando tu experiencia
          </Text>
          
          {/* Contenedor de la barra */}
          <View className="w-72 h-2 bg-white/20 rounded-full overflow-hidden">
            <Animated.View
              style={{
                width: progressWidth,
                height: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
              }}
            />
          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="absolute bottom-12 items-center"
        >
          <View className="flex-row items-center space-x-2 mb-2">
            <View className="w-2 h-2 rounded-full bg-white/60" />
            <Text className="text-blue-200 text-xs font-montserrat">
              Powered by React Native + Expo
            </Text>
            <View className="w-2 h-2 rounded-full bg-white/60" />
          </View>
          <Text className="text-blue-300 text-xs font-montserrat">
            UNIR • Proyecto Nexus • 2024
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;