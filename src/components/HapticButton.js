import React from 'react';
import { Pressable, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

const HapticButton = ({ 
  onPress, 
  title, 
  className = '',
  textClassName = '',
  hapticType = 'medium',
  icon = ''
}) => {
  
  const handlePress = () => {
    switch(hapticType) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`bg-primary-600 py-4 px-6 rounded-2xl active:opacity-80 active:scale-95 shadow-medium flex-row items-center justify-center ${className}`}
    >
      {icon && <Text className="text-2xl mr-2">{icon}</Text>}
      <Text className={`text-white text-center font-poppins-bold text-lg ${textClassName}`}>
        {title}
      </Text>
    </Pressable>
  );
};

export default HapticButton;
