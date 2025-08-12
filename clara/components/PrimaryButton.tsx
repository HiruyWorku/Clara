import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useColors } from '../hooks/useColors';
import { Typography, BorderRadius, Spacing, Shadows } from '../constants/Colors';
import * as Haptics from 'expo-haptics';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PrimaryButton({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false 
}: Props) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      ...Shadows.sm,
    };

    const sizeStyles = {
      sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
      md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
      lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl },
    };

    const variantStyles = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: colors.secondary },
      success: { backgroundColor: colors.success },
      danger: { backgroundColor: colors.error },
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...sizeStyles[size],
        backgroundColor: colors.textTertiary,
        ...Shadows.sm,
      };
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      width: fullWidth ? '100%' : undefined,
    };
  };

  const getTextStyle = () => {
    const baseStyle = {
      color: colors.textInverse,
      fontWeight: Typography.semibold,
      textAlign: 'center' as const,
    };

    const sizeStyles = {
      sm: { fontSize: Typography.sm },
      md: { fontSize: Typography.base },
      lg: { fontSize: Typography.lg },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
    };
  };

  return (
    <AnimatedPressable
      style={[getButtonStyle(), animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </AnimatedPressable>
  );
}


