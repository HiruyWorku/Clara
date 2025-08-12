import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { speak, listenOnce } from '../lib/voice';
import { useColors } from '../hooks/useColors';
import { Typography, BorderRadius, Spacing } from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import PrimaryButton from './PrimaryButton';
import * as Haptics from 'expo-haptics';

type Props = {
  prompt: string;
  onResult: (result: { intent?: 'yes' | 'no'; freeText?: string } | null) => void;
};

export default function VoiceBar({ prompt, onResult }: Props) {
  const colors = useColors();
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const onSpeak = async () => {
    setSpeaking(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await speak(prompt);
    setSpeaking(false);
  };

  const onListen = async () => {
    if (listening) return;
    setListening(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const res = await listenOnce();
    setListening(false);
    onResult(res);
  };

  return (
    <View style={{
      backgroundColor: colors.backgroundSecondary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: Spacing.md,
      }}>
        <Ionicons name="mic-outline" size={20} color={colors.primary} />
        <Text style={{ 
          fontSize: Typography.base,
          fontWeight: Typography.medium,
          color: colors.text,
          marginLeft: Spacing.sm,
        }}>
          Voice Assistant
        </Text>
      </View>
      
      <Text style={{ 
        fontSize: Typography.sm,
        color: colors.textSecondary,
        marginBottom: Spacing.md,
        lineHeight: Typography.sm * 1.4,
      }}>
        Use voice commands or tap the buttons below
      </Text>
      
      <View style={{ flexDirection: 'row', gap: Spacing.md }}>
        <PrimaryButton
          title={speaking ? "Speaking..." : "🔊 Play Question"}
          onPress={onSpeak}
          disabled={speaking}
          variant="secondary"
          size="sm"
        />
        
        <PrimaryButton
          title={listening ? "Listening..." : "🎤 Voice Answer"}
          onPress={onListen}
          disabled={listening || speaking}
          variant="primary"
          size="sm"
        />
      </View>
      
      {(listening || speaking) && (
        <View style={{ 
          alignItems: 'center', 
          marginTop: Spacing.md,
          paddingTop: Spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={{ 
            fontSize: Typography.xs,
            color: colors.textTertiary,
            marginTop: Spacing.xs,
          }}>
            {speaking ? 'Clara is speaking...' : 'Listening for your response...'}
          </Text>
        </View>
      )}
    </View>
  );
}


