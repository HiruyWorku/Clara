import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Switch, Alert } from 'react-native';
import { useSettingsStore } from '../stores/settings';
import { requestPermissions, scheduleDailyReminder } from '../lib/notifications';
import { exportAllToJson, shareFile } from '../lib/export';
import ScreenWrapper from '../components/ScreenWrapper';
import PrimaryButton from '../components/PrimaryButton';
import { useColors } from '../hooks/useColors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const colors = useColors();
  const refresh = useSettingsStore((s) => s.refresh);
  const notifyHour = useSettingsStore((s) => s.notifyHour);
  const notifyMin = useSettingsStore((s) => s.notifyMin);
  const setTime = useSettingsStore((s) => s.setNotificationTime);
  const voiceEnabled = useSettingsStore((s) => s.voiceEnabled);
  const sttEnabled = useSettingsStore((s) => s.sttEnabled);
  const setVoiceEnabled = useSettingsStore((s) => s.setVoiceEnabled);
  const setSttEnabled = useSettingsStore((s) => s.setSttEnabled);

  const [hour, setHour] = useState('20');
  const [min, setMin] = useState('0');
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  useEffect(() => {
    if (notifyHour != null) setHour(String(notifyHour));
    if (notifyMin != null) setMin(String(notifyMin));
  }, [notifyHour, notifyMin]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const onSaveTime = async () => {
    const h = parseInt(hour, 10);
    const m = parseInt(min, 10);
    if (Number.isNaN(h) || Number.isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      Alert.alert('Invalid time', 'Please enter a valid time (0-23 hours, 0-59 minutes)');
      return;
    }
    
    await setTime(h, m);
    const granted = await requestPermissions();
    if (granted) {
      await scheduleDailyReminder(h, m);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', `Daily reminder set for ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    } else {
      Alert.alert('Permission Required', 'Please enable notifications in your device settings to receive daily reminders.');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const fileUri = await exportAllToJson();
      await shareFile(fileUri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Export Failed', 'Could not export your data. Please try again.');
    } finally {
      setExporting(false);
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
    textAlign: 'center' as const,
    minHeight: 48,
    width: 80,
  };

  const SettingCard = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...Shadows.sm,
    }}>
      <Text style={{ 
        fontSize: Typography.lg, 
        fontWeight: Typography.semibold, 
        color: colors.text,
        marginBottom: Spacing.md,
      }}>
        {title}
      </Text>
      {children}
    </View>
  );

  const ToggleRow = ({ 
    label, 
    description, 
    value, 
    onValueChange, 
    icon 
  }: { 
    label: string; 
    description: string; 
    value: boolean; 
    onValueChange: (value: boolean) => void;
    icon: keyof typeof Ionicons.glyphMap;
  }) => (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      paddingVertical: Spacing.sm,
    }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon} size={20} color={colors.primary} style={{ marginRight: Spacing.md }} />
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: Typography.base,
            fontWeight: Typography.medium,
            color: colors.text,
          }}>
            {label}
          </Text>
          <Text style={{ 
            fontSize: Typography.sm,
            color: colors.textSecondary,
            marginTop: 2,
          }}>
            {description}
          </Text>
        </View>
      </View>
      <Switch 
        value={value} 
        onValueChange={(val) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onValueChange(val);
        }}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.textTertiary}
      />
    </View>
  );

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
          Settings
        </Text>
        <Text style={{ 
          fontSize: Typography.base, 
          color: colors.textSecondary,
        }}>
          Customize your Clara experience
        </Text>
      </Animated.View>

      {/* Notifications Settings */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)}>
        <SettingCard title="Daily Reminders">
          <Text style={{ 
            fontSize: Typography.base,
            color: colors.textSecondary,
            marginBottom: Spacing.md,
          }}>
            Set when you'd like to receive your daily check-in reminder
          </Text>
          
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: Spacing.md,
            marginBottom: Spacing.md,
          }}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <TextInput 
              value={hour} 
              onChangeText={setHour} 
              keyboardType="numeric" 
              placeholder="20"
              placeholderTextColor={colors.textTertiary}
              style={inputStyle}
              maxLength={2}
            />
            <Text style={{ 
              fontSize: Typography.lg, 
              fontWeight: Typography.bold,
              color: colors.text,
            }}>
              :
            </Text>
            <TextInput 
              value={min} 
              onChangeText={setMin} 
              keyboardType="numeric" 
              placeholder="00"
              placeholderTextColor={colors.textTertiary}
              style={inputStyle}
              maxLength={2}
            />
            <Text style={{ 
              fontSize: Typography.sm,
              color: colors.textSecondary,
              flex: 1,
            }}>
              (24-hour format)
            </Text>
          </View>
          
          <PrimaryButton 
            title="Save Time" 
            onPress={onSaveTime} 
            size="sm"
          />
        </SettingCard>
      </Animated.View>

      {/* Voice Settings */}
      <Animated.View entering={FadeInDown.delay(300).duration(600)}>
        <SettingCard title="Voice & Speech">
          <ToggleRow
            icon="volume-high-outline"
            label="Text-to-Speech (TTS)"
            description="Clara will read questions aloud"
            value={voiceEnabled}
            onValueChange={setVoiceEnabled}
          />
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: Spacing.sm }} />
          <ToggleRow
            icon="mic-outline"
            label="Speech Recognition (STT)"
            description="Respond with your voice (requires dev build)"
            value={sttEnabled}
            onValueChange={setSttEnabled}
          />
        </SettingCard>
      </Animated.View>

      {/* Data Management */}
      <Animated.View entering={FadeInDown.delay(400).duration(600)}>
        <SettingCard title="Data Management">
          <Text style={{ 
            fontSize: Typography.base,
            color: colors.textSecondary,
            marginBottom: Spacing.md,
          }}>
            Export your rooms, check-ins, and settings as a JSON file
          </Text>
          
          <PrimaryButton 
            title={exporting ? "Exporting..." : "Export Data"}
            onPress={handleExport}
            disabled={exporting}
            variant="secondary"
            fullWidth
          />
        </SettingCard>
      </Animated.View>

      {/* About */}
      <Animated.View entering={FadeInDown.delay(500).duration(600)}>
        <SettingCard title="About Clara">
          <View style={{ gap: Spacing.sm }}>
            <Text style={{ 
              fontSize: Typography.base,
              color: colors.textSecondary,
              lineHeight: Typography.base * 1.4,
            }}>
              Clara is your personal tidy life coach, helping you build consistent habits and maintain organized spaces.
            </Text>
            <Text style={{ 
              fontSize: Typography.sm,
              color: colors.textTertiary,
            }}>
              Version 1.0.0 • Built with React Native & Expo
            </Text>
          </View>
        </SettingCard>
      </Animated.View>
    </ScreenWrapper>
  );
}