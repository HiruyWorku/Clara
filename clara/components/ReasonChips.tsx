import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useColors } from '../hooks/useColors';
import { Typography, BorderRadius, Spacing } from '../constants/Colors';
import * as Haptics from 'expo-haptics';

const DEFAULT_REASONS = ['Busy day', 'Guests', 'Laundry', 'Travel', 'Low energy', 'Other'];

type Props = {
  selected?: string | null;
  onSelect: (reason: string) => void;
  reasons?: string[];
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ReasonChip({ reason, isSelected, onPress }: { reason: string; isSelected: boolean; onPress: () => void }) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const chipStyle = {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: isSelected ? colors.primary : colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: isSelected ? colors.primary : colors.border,
  };

  const textStyle = {
    color: isSelected ? colors.textInverse : colors.text,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  };

  return (
    <AnimatedPressable
      style={[chipStyle, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Text style={textStyle}>{reason}</Text>
    </AnimatedPressable>
  );
}

export default function ReasonChips({ selected, onSelect, reasons = DEFAULT_REASONS }: Props) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
      {reasons.map((reason) => (
        <ReasonChip
          key={reason}
          reason={reason}
          isSelected={selected === reason}
          onPress={() => onSelect(reason)}
        />
      ))}
    </View>
  );
}


