import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../hooks/useColors';
import { Spacing } from '../constants/Colors';

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  padding?: boolean;
};

export default function ScreenWrapper({ 
  children, 
  scrollable = true, 
  refreshing = false, 
  onRefresh,
  padding = true 
}: Props) {
  const colors = useColors();

  const containerStyle = {
    flex: 1,
    backgroundColor: colors.background,
  };

  const contentStyle = {
    flexGrow: 1,
    padding: padding ? Spacing.md : 0,
  };

  if (scrollable) {
    return (
      <SafeAreaView style={containerStyle}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <View style={contentStyle}>
        {children}
      </View>
    </SafeAreaView>
  );
}
