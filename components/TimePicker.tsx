import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Typography, Spacing, BorderRadius } from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

interface TimePickerProps {
  hour: number;
  minute: number;
  onTimeChange: (hour: number, minute: number) => void;
}

export default function TimePicker({ hour, minute, onTimeChange }: TimePickerProps) {
  const colors = useColors();
  const [displayHour, setDisplayHour] = useState('12');
  const [displayMinute, setDisplayMinute] = useState('00');
  const [isPM, setIsPM] = useState(false);

  // Convert 24-hour to 12-hour format
  useEffect(() => {
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12;
    
    setDisplayHour(String(hour12));
    setDisplayMinute(String(minute).padStart(2, '0'));
    setIsPM(ampm);
  }, [hour, minute]);

  // Convert back to 24-hour format and notify parent
  const updateTime = (newHour: string, newMinute: string, newIsPM: boolean) => {
    const hour12 = parseInt(newHour, 10);
    const min = parseInt(newMinute, 10);
    
    if (isNaN(hour12) || isNaN(min) || hour12 < 1 || hour12 > 12 || min < 0 || min > 59) {
      return;
    }
    
    let hour24 = hour12;
    if (newIsPM && hour12 !== 12) {
      hour24 = hour12 + 12;
    } else if (!newIsPM && hour12 === 12) {
      hour24 = 0;
    }
    
    onTimeChange(hour24, min);
  };

  const handleHourChange = (value: string) => {
    setDisplayHour(value);
    updateTime(value, displayMinute, isPM);
  };

  const handleMinuteChange = (value: string) => {
    setDisplayMinute(value);
    updateTime(displayHour, value, isPM);
  };

  const toggleAMPM = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newIsPM = !isPM;
    setIsPM(newIsPM);
    updateTime(displayHour, displayMinute, newIsPM);
  };

  const inputStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold as any,
    textAlign: 'center' as const,
    minHeight: 56,
    width: 80,
  };

  const ampmButtonStyle = {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    minHeight: 56,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    minWidth: 60,
  };

  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: Spacing.md,
    }}>
      <Ionicons name="time-outline" size={24} color={colors.primary} />
      
      {/* Hour Input */}
      <TextInput 
        value={displayHour} 
        onChangeText={handleHourChange} 
        keyboardType="numeric" 
        placeholder="12"
        placeholderTextColor={colors.textTertiary}
        style={inputStyle}
        maxLength={2}
        selectTextOnFocus
      />
      
      {/* Colon */}
      <Text style={{ 
        fontSize: Typography['2xl'], 
        fontWeight: Typography.bold,
        color: colors.text,
      }}>
        :
      </Text>
      
      {/* Minute Input */}
      <TextInput 
        value={displayMinute} 
        onChangeText={handleMinuteChange} 
        keyboardType="numeric" 
        placeholder="00"
        placeholderTextColor={colors.textTertiary}
        style={inputStyle}
        maxLength={2}
        selectTextOnFocus
      />
      
      {/* AM/PM Toggle */}
      <Pressable 
        style={[
          ampmButtonStyle,
          { 
            backgroundColor: isPM ? colors.primary : colors.surface,
            borderColor: isPM ? colors.primary : colors.border,
          }
        ]}
        onPress={toggleAMPM}
      >
        <Text style={{ 
          fontSize: Typography.base,
          fontWeight: Typography.semibold,
          color: isPM ? colors.white : colors.text,
        }}>
          {isPM ? 'PM' : 'AM'}
        </Text>
      </Pressable>
      
      {/* Current Time Display */}
      <View style={{ flex: 1, marginLeft: Spacing.sm }}>
        <Text style={{ 
          fontSize: Typography.sm,
          color: colors.textSecondary,
          marginBottom: 2,
        }}>
          Daily reminder at:
        </Text>
        <Text style={{ 
          fontSize: Typography.base,
          fontWeight: Typography.medium,
          color: colors.text,
        }}>
          {displayHour}:{displayMinute.padStart(2, '0')} {isPM ? 'PM' : 'AM'}
        </Text>
      </View>
    </View>
  );
}
