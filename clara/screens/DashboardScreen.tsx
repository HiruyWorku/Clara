import React, { useEffect, useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { useRoomsStore } from '../stores/rooms';
import RoomCard from '../components/RoomCard';
import ScreenWrapper from '../components/ScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';
import { useColors } from '../hooks/useColors';
import { Typography, Spacing } from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DashboardScreen() {
  const colors = useColors();
  const rooms = useRoomsStore((s) => s.rooms);
  const refresh = useRoomsStore((s) => s.refresh);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    return 'Good evening!';
  };

  const getTotalStreak = () => {
    // TODO: Calculate actual streaks from checkins
    return rooms.length * 2; // Placeholder
  };

  const getActiveRooms = () => {
    return rooms.length;
  };

  return (
    <ScreenWrapper 
      refreshing={refreshing} 
      onRefresh={handleRefresh}
    >
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
          {getGreeting()}
        </Text>
        <Text style={{ 
          fontSize: Typography.base, 
          color: colors.textSecondary,
        }}>
          Welcome back to Clara
        </Text>
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View 
        entering={FadeInDown.delay(200).duration(600)}
        style={{ 
          flexDirection: 'row', 
          marginBottom: Spacing.xl,
          gap: Spacing.md,
        }}
      >
        <View style={{
          flex: 1,
          backgroundColor: colors.surface,
          padding: Spacing.lg,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
        }}>
          <Ionicons name="flame" size={24} color={colors.primary} />
          <Text style={{ 
            fontSize: Typography['2xl'], 
            fontWeight: Typography.bold, 
            color: colors.text,
            marginTop: Spacing.xs,
          }}>
            {getTotalStreak()}
          </Text>
          <Text style={{ 
            fontSize: Typography.sm, 
            color: colors.textSecondary,
            textAlign: 'center',
          }}>
            Total Streaks
          </Text>
        </View>

        <View style={{
          flex: 1,
          backgroundColor: colors.surface,
          padding: Spacing.lg,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
        }}>
          <Ionicons name="business" size={24} color={colors.secondary} />
          <Text style={{ 
            fontSize: Typography['2xl'], 
            fontWeight: Typography.bold, 
            color: colors.text,
            marginTop: Spacing.xs,
          }}>
            {getActiveRooms()}
          </Text>
          <Text style={{ 
            fontSize: Typography.sm, 
            color: colors.textSecondary,
            textAlign: 'center',
          }}>
            Active Rooms
          </Text>
        </View>
      </Animated.View>

      {/* Rooms Section */}
      <Animated.View entering={FadeInDown.delay(300).duration(600)}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: Spacing.lg,
        }}>
          <Text style={{ 
            fontSize: Typography.xl, 
            fontWeight: Typography.semibold, 
            color: colors.text,
          }}>
            Your Rooms
          </Text>
        </View>

        {rooms.length === 0 ? (
          <View style={{ 
            alignItems: 'center', 
            padding: Spacing.xxl,
            backgroundColor: colors.backgroundSecondary,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Ionicons name="home-outline" size={48} color={colors.textTertiary} />
            <Text style={{ 
              fontSize: Typography.lg, 
              fontWeight: Typography.medium,
              color: colors.textSecondary,
              marginTop: Spacing.md,
              textAlign: 'center',
            }}>
              No rooms yet
            </Text>
            <Text style={{ 
              fontSize: Typography.base, 
              color: colors.textTertiary,
              textAlign: 'center',
              marginTop: Spacing.xs,
            }}>
              Add your first room in the Rooms tab to get started
            </Text>
          </View>
        ) : (
          rooms.map((room, index) => (
            <Animated.View 
              key={room.id}
              entering={FadeInDown.delay(400 + index * 100).duration(600)}
            >
              <RoomCard 
                name={room.name} 
                emoji={room.emoji} 
                currentStreak={Math.floor(Math.random() * 10)} // TODO: Real streak calculation
                lastResult={Math.random() > 0.5 ? 'yes' : 'no'} // TODO: Real last result
              />
            </Animated.View>
          ))
        )}
      </Animated.View>
    </ScreenWrapper>
  );
}


