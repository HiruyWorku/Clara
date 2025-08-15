import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useColors } from '../hooks/useColors';
import { Typography, BorderRadius, Spacing, Shadows } from '../constants/Colors';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  name: string;
  emoji?: string | null;
  currentStreak?: number;
  lastResult?: 'yes' | 'no' | null;
  onPress?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RoomCard({ name, emoji, currentStreak = 0, lastResult, onPress }: Props) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const getStreakColor = () => {
    if (currentStreak === 0) return colors.textTertiary;
    if (currentStreak >= 7) return colors.success;
    if (currentStreak >= 3) return colors.secondary;
    return colors.primary;
  };

  const getLastResultIcon = () => {
    if (lastResult === 'yes') return 'checkmark-circle';
    if (lastResult === 'no') return 'close-circle';
    return 'help-circle-outline';
  };

  const getLastResultColor = () => {
    if (lastResult === 'yes') return colors.tidyGreen;
    if (lastResult === 'no') return colors.untidyRed;
    return colors.textTertiary;
  };

  const cardStyle = {
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadows.md,
  };

  return (
    <AnimatedPressable
      style={[cardStyle, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={!onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
            {emoji && (
              <Text style={{ fontSize: Typography['2xl'], marginRight: Spacing.sm }}>
                {emoji}
              </Text>
            )}
            <Text style={{ 
              fontSize: Typography.lg, 
              fontWeight: Typography.semibold, 
              color: colors.text,
              flex: 1,
            }}>
              {name}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons 
                name="flame" 
                size={16} 
                color={getStreakColor()} 
                style={{ marginRight: Spacing.xs }} 
              />
              <Text style={{ 
                fontSize: Typography.sm, 
                color: getStreakColor(),
                fontWeight: Typography.medium,
              }}>
                {currentStreak > 0 ? `${currentStreak} day streak` : 'No streak yet'}
              </Text>
            </View>
            
            {lastResult && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons 
                  name={getLastResultIcon()} 
                  size={18} 
                  color={getLastResultColor()} 
                />
              </View>
            )}
          </View>
        </View>
        
        {onPress && (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={colors.textTertiary} 
            style={{ marginLeft: Spacing.sm }}
          />
        )}
      </View>
    </AnimatedPressable>
  );
}


