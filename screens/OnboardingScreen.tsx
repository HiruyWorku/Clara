import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PrimaryButton from '../components/PrimaryButton';
import ScreenWrapper from '../components/ScreenWrapper';
import { useRoomsStore } from '../stores/rooms';
import { useSettingsStore } from '../stores/settings';
import { useColors } from '../hooks/useColors';
import { Typography, Spacing, BorderRadius } from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const schema = z.object({
  roomName: z.string().min(1, 'Please enter a room name'),
  emoji: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const colors = useColors();
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({ 
    resolver: zodResolver(schema) 
  });
  const addRoom = useRoomsStore((s) => s.addRoom);
  const refreshSettings = useSettingsStore((s) => s.refresh);

  const onSubmit = async (values: FormValues) => {
    try {
      console.log('🎯 Onboarding: Adding room:', values);
      await addRoom(values.roomName.trim(), values.emoji ?? null);
      await refreshSettings();
      console.log('✅ Onboarding complete, calling onDone');
      onDone();
    } catch (error) {
      console.error('❌ Onboarding failed:', error);
    }
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: Typography.base,
    minHeight: 48,
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: colors.error,
  };

  return (
    <ScreenWrapper scrollable={false}>
      <View style={{ flex: 1, justifyContent: 'center', padding: Spacing.lg }}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(800)}
          style={{ alignItems: 'center', marginBottom: Spacing.xxl }}
        >
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.lg,
          }}>
            <Ionicons name="home" size={40} color={colors.textInverse} />
          </View>
          
          <Text style={{ 
            fontSize: Typography['3xl'], 
            fontWeight: Typography.bold, 
            color: colors.text,
            textAlign: 'center',
            marginBottom: Spacing.sm,
          }}>
            Welcome to Clara
          </Text>
          
          <Text style={{ 
            fontSize: Typography.lg, 
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: Typography.lg * 1.4,
          }}>
            Your personal tidy life coach.{'\n'}Let's set up your first room.
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View entering={FadeInDown.delay(300).duration(800)}>
          <View style={{ marginBottom: Spacing.lg }}>
            <Text style={{ 
              fontSize: Typography.base,
              fontWeight: Typography.medium,
              color: colors.text,
              marginBottom: Spacing.sm,
            }}>
              Room name
            </Text>
            <Controller
              control={control}
              name="roomName"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <TextInput 
                    value={value} 
                    onChangeText={onChange} 
                    placeholder="e.g., Kitchen, Bedroom, Living Room" 
                    placeholderTextColor={colors.textTertiary}
                    style={error ? errorInputStyle : inputStyle}
                  />
                  {error && (
                    <Text style={{ 
                      color: colors.error, 
                      fontSize: Typography.sm,
                      marginTop: Spacing.xs,
                    }}>
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          <View style={{ marginBottom: Spacing.xl }}>
            <Text style={{ 
              fontSize: Typography.base,
              fontWeight: Typography.medium,
              color: colors.text,
              marginBottom: Spacing.sm,
            }}>
              Emoji (optional)
            </Text>
            <Controller
              control={control}
              name="emoji"
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  value={value} 
                  onChangeText={onChange} 
                  placeholder="🍽️ 🛏️ 🛋️ 🛁" 
                  placeholderTextColor={colors.textTertiary}
                  style={inputStyle}
                />
              )}
            />
          </View>

          <PrimaryButton 
            title="Get Started" 
            onPress={handleSubmit(onSubmit)} 
            size="lg"
            fullWidth
          />
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}


