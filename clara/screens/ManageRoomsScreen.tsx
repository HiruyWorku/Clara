import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useRoomsStore } from '../stores/rooms';
import ScreenWrapper from '../components/ScreenWrapper';
import PrimaryButton from '../components/PrimaryButton';
import { useColors } from '../hooks/useColors';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

export default function ManageRoomsScreen() {
  const colors = useColors();
  const rooms = useRoomsStore((s) => s.rooms);
  const refresh = useRoomsStore((s) => s.refresh);
  const addRoom = useRoomsStore((s) => s.addRoom);
  const renameRoom = useRoomsStore((s) => s.renameRoom);
  const archiveRoom = useRoomsStore((s) => s.archiveRoom);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
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

  const handleAddRoom = async () => {
    if (!name.trim()) return;
    
    try {
      console.log('🏠 Adding room from UI:', name.trim(), emoji || null);
      await addRoom(name.trim(), emoji || null);
      console.log('✅ Room add completed, clearing form');
      setName('');
      setEmoji('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('❌ Error adding room:', error);
    }
  };

  const handleArchiveRoom = (roomId: string, roomName: string) => {
    Alert.alert(
      'Archive Room',
      `Are you sure you want to archive "${roomName}"? This will hide it from your daily check-ins.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Archive', 
          style: 'destructive',
          onPress: () => {
            archiveRoom(roomId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
        }
      ]
    );
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
          Your Rooms
        </Text>
        <Text style={{ 
          fontSize: Typography.base, 
          color: colors.textSecondary,
        }}>
          Manage the spaces you want to keep tidy
        </Text>
      </Animated.View>

      {/* Add Room Form */}
      <Animated.View 
        entering={FadeInDown.delay(200).duration(600)}
        style={{
          backgroundColor: colors.surface,
          borderRadius: BorderRadius.lg,
          padding: Spacing.lg,
          marginBottom: Spacing.xl,
          borderWidth: 1,
          borderColor: colors.border,
          ...Shadows.sm,
        }}
      >
        <Text style={{ 
          fontSize: Typography.lg, 
          fontWeight: Typography.semibold, 
          color: colors.text,
          marginBottom: Spacing.lg,
        }}>
          Add New Room
        </Text>
        
        <View style={{ gap: Spacing.md }}>
          <View>
            <Text style={{ 
              fontSize: Typography.sm,
              fontWeight: Typography.medium,
              color: colors.text,
              marginBottom: Spacing.xs,
            }}>
              Room name
            </Text>
            <TextInput 
              placeholder="e.g., Kitchen, Bedroom, Living Room" 
              placeholderTextColor={colors.textTertiary}
              value={name} 
              onChangeText={setName} 
              style={inputStyle}
            />
          </View>
          
          <View>
            <Text style={{ 
              fontSize: Typography.sm,
              fontWeight: Typography.medium,
              color: colors.text,
              marginBottom: Spacing.xs,
            }}>
              Emoji (optional)
            </Text>
            <TextInput 
              placeholder="🍽️ 🛏️ 🛋️ 🛁" 
              placeholderTextColor={colors.textTertiary}
              value={emoji} 
              onChangeText={setEmoji} 
              style={inputStyle}
            />
          </View>
          
          <PrimaryButton 
            title="Add Room" 
            onPress={handleAddRoom} 
            disabled={!name.trim()}
            fullWidth
          />
        </View>
      </Animated.View>

      {/* Rooms List */}
      <Animated.View entering={FadeInDown.delay(300).duration(600)}>
        <Text style={{ 
          fontSize: Typography.lg, 
          fontWeight: Typography.semibold, 
          color: colors.text,
          marginBottom: Spacing.lg,
        }}>
          Current Rooms ({rooms.length})
        </Text>

        {rooms.length === 0 ? (
          <View style={{ 
            alignItems: 'center', 
            padding: Spacing.xxl,
            backgroundColor: colors.backgroundSecondary,
            borderRadius: BorderRadius.lg,
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
              Add your first room above to get started
            </Text>
          </View>
        ) : (
          <View style={{ gap: Spacing.md }}>
            {rooms.map((room, index) => (
              <Animated.View 
                key={room.id}
                entering={FadeInUp.delay(400 + index * 100).duration(600)}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: BorderRadius.lg,
                  padding: Spacing.lg,
                  borderWidth: 1,
                  borderColor: colors.border,
                  ...Shadows.sm,
                }}
              >
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: Spacing.md,
                }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    {room.emoji && (
                      <Text style={{ 
                        fontSize: Typography.xl, 
                        marginRight: Spacing.sm,
                      }}>
                        {room.emoji}
                      </Text>
                    )}
                    <Text style={{ 
                      fontSize: Typography.lg, 
                      fontWeight: Typography.semibold, 
                      color: colors.text,
                      flex: 1,
                    }}>
                      {room.name}
                    </Text>
                  </View>
                </View>
                
                <View style={{ 
                  flexDirection: 'row', 
                  gap: Spacing.sm,
                }}>
                  <PrimaryButton 
                    title="Rename" 
                    onPress={() => {
                      // Simple rename for now - could be enhanced with a modal
                      renameRoom(room.id, room.name + ' ✏️');
                    }} 
                    variant="secondary"
                    size="sm"
                  />
                  <PrimaryButton 
                    title="Archive" 
                    onPress={() => handleArchiveRoom(room.id, room.name)} 
                    variant="danger"
                    size="sm"
                  />
                </View>
              </Animated.View>
            ))}
          </View>
        )}
      </Animated.View>
    </ScreenWrapper>
  );
}