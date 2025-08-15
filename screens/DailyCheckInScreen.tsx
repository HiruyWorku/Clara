import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useRoomsStore } from '../stores/rooms';
import { useCheckinsStore } from '../stores/checkins';
import { format } from 'date-fns';
import VoiceBar from '../components/VoiceBar';
import ReasonChips from '../components/ReasonChips';
import ScreenWrapper from '../components/ScreenWrapper';
import PrimaryButton from '../components/PrimaryButton';
import { useFocusEffect } from '@react-navigation/native';
import { useColors } from '../hooks/useColors';
import { Typography, Spacing, BorderRadius } from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown, FadeInUp, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function DailyCheckInScreen() {
  const colors = useColors();
  const rooms = useRoomsStore((s) => s.rooms);
  const refreshRooms = useRoomsStore((s) => s.refresh);
  const addCheckin = useCheckinsStore((s) => s.addCheckin);
  const today = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [askingReason, setAskingReason] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshRooms();
  }, [refreshRooms]);

  useFocusEffect(
    useCallback(() => {
      refreshRooms();
      setCurrentIndex(0);
      setAskingReason(false);
      setReason(null);
    }, [refreshRooms])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshRooms();
    setCurrentIndex(0);
    setAskingReason(false);
    setReason(null);
    setRefreshing(false);
  };

  const currentRoom = rooms[currentIndex];

  const onYes = async () => {
    if (!currentRoom) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addCheckin({ roomId: currentRoom.id, date: today, isTidy: true });
    nextRoom();
  };

  const onNo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAskingReason(true);
  };

  const onSaveReason = async () => {
    const text = reason ?? '';
    if (!currentRoom) return;
    await addCheckin({ roomId: currentRoom.id, date: today, isTidy: false, reason: text });
    setReason(null);
    setAskingReason(false);
    nextRoom();
  };

  const nextRoom = () => {
    if (currentIndex + 1 < rooms.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('🎉 All done!', 'Great job logging today\'s check-ins!');
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

  if (rooms.length === 0) {
    return (
      <ScreenWrapper refreshing={refreshing} onRefresh={handleRefresh}>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: Spacing.xl,
        }}>
          <Ionicons name="checkmark-circle-outline" size={64} color={colors.textTertiary} />
          <Text style={{ 
            fontSize: Typography.xl, 
            fontWeight: Typography.semibold,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: Spacing.lg,
            marginBottom: Spacing.sm,
          }}>
            No rooms to check in
          </Text>
          <Text style={{ 
            fontSize: Typography.base, 
            color: colors.textTertiary,
            textAlign: 'center',
            lineHeight: Typography.base * 1.4,
          }}>
            Add some rooms in the Rooms tab{'\n'}to start your daily check-ins
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper refreshing={refreshing} onRefresh={handleRefresh}>
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(100).duration(600)}
        style={{ marginBottom: Spacing.xl }}
      >
        <Text style={{ 
          fontSize: Typography['3xl'], 
          fontWeight: Typography.bold, 
          color: colors.text,
          marginBottom: Spacing.xs,
        }}>
          Daily Check-in
        </Text>
        <Text style={{ 
          fontSize: Typography.base, 
          color: colors.textSecondary,
        }}>
          Room {currentIndex + 1} of {rooms.length}
        </Text>
      </Animated.View>

      {/* Progress Bar */}
      <Animated.View 
        entering={FadeInDown.delay(200).duration(600)}
        style={{ 
          height: 4, 
          backgroundColor: colors.backgroundSecondary, 
          borderRadius: 2,
          marginBottom: Spacing.xl,
        }}
      >
        <Animated.View 
          style={{ 
            height: '100%', 
            backgroundColor: colors.primary,
            borderRadius: 2,
            width: `${((currentIndex + 1) / rooms.length) * 100}%`,
          }}
        />
      </Animated.View>

      {currentRoom && (
        <Animated.View 
          key={currentRoom.id}
          entering={SlideInRight.duration(400)}
          exiting={SlideOutLeft.duration(300)}
        >
          {!askingReason ? (
            <>
              {/* Room Card */}
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.lg,
                padding: Spacing.xl,
                marginBottom: Spacing.xl,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
              }}>
                {currentRoom.emoji && (
                  <Text style={{ 
                    fontSize: 64, 
                    marginBottom: Spacing.md,
                  }}>
                    {currentRoom.emoji}
                  </Text>
                )}
                <Text style={{ 
                  fontSize: Typography['2xl'], 
                  fontWeight: Typography.bold, 
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: Spacing.sm,
                }}>
                  {currentRoom.name}
                </Text>
                <Text style={{ 
                  fontSize: Typography.lg, 
                  color: colors.textSecondary,
                  textAlign: 'center',
                }}>
                  Is this room tidy today?
                </Text>
              </View>

              {/* Voice Bar */}
              <View style={{ marginBottom: Spacing.xl }}>
                <VoiceBar
                  prompt={`Is the ${currentRoom.name} tidy today? Say yes or no.`}
                  onResult={(r) => {
                    if (!r) return;
                    if (r.intent === 'yes') onYes();
                    else if (r.intent === 'no') onNo();
                  }}
                />
              </View>

              {/* Action Buttons */}
              <View style={{ gap: Spacing.md }}>
                <PrimaryButton 
                  title="✅ Yes, it's tidy!" 
                  onPress={onYes} 
                  variant="success"
                  size="lg"
                  fullWidth
                />
                <PrimaryButton 
                  title="❌ No, needs work" 
                  onPress={onNo} 
                  variant="danger"
                  size="lg"
                  fullWidth
                />
              </View>
            </>
          ) : (
            <Animated.View entering={FadeInUp.delay(100).duration(600)}>
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.lg,
                padding: Spacing.xl,
                marginBottom: Spacing.xl,
                borderWidth: 1,
                borderColor: colors.border,
              }}>
                <Text style={{ 
                  fontSize: Typography.xl, 
                  fontWeight: Typography.semibold, 
                  color: colors.text,
                  marginBottom: Spacing.lg,
                  textAlign: 'center',
                }}>
                  What happened with {currentRoom.name}?
                </Text>
                
                <View style={{ marginBottom: Spacing.lg }}>
                  <ReasonChips selected={reason} onSelect={setReason} />
                </View>
                
                <TextInput
                  placeholder="Add a quick note (optional)"
                  placeholderTextColor={colors.textTertiary}
                  value={reason ?? ''}
                  onChangeText={setReason}
                  style={inputStyle}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={{ gap: Spacing.md }}>
                <PrimaryButton 
                  title="Save & Continue" 
                  onPress={onSaveReason} 
                  size="lg"
                  fullWidth
                />
                <PrimaryButton 
                  title="Skip" 
                  onPress={() => {
                    setReason(null);
                    setAskingReason(false);
                    nextRoom();
                  }} 
                  variant="secondary"
                  size="lg"
                  fullWidth
                />
              </View>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </ScreenWrapper>
  );
}