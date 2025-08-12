import React from 'react';
import 'react-native-reanimated';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme, StatusBar } from 'react-native';
import DashboardScreen from './screens/DashboardScreen';
import DailyCheckInScreen from './screens/DailyCheckInScreen';
import ManageRoomsScreen from './screens/ManageRoomsScreen';
import SettingsScreen from './screens/SettingsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { useRoomsStore } from './stores/rooms';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColors } from './hooks/useColors';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function AppContent() {
  const colors = useColors();
  const scheme = useColorScheme();
  const rooms = useRoomsStore((s) => s.rooms);
  const refreshRooms = useRoomsStore((s) => s.refresh);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    refreshRooms().then(() => {
      setIsInitialized(true);
    });
  }, [refreshRooms]);

  React.useEffect(() => {
    if (isInitialized) {
      setShowOnboarding(rooms.length === 0);
    }
  }, [rooms.length, isInitialized]);

  const customTheme = {
    ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      border: colors.border,
      primary: colors.primary,
    },
  };

  if (showOnboarding) {
    return <OnboardingScreen onDone={() => setShowOnboarding(false)} />;
  }

  return (
    <NavigationContainer theme={customTheme}>
      <StatusBar 
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Check-in') {
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
            } else if (route.name === 'Rooms') {
              iconName = focused ? 'business' : 'business-outline';
            } else {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 85,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Check-in" component={DailyCheckInScreen} />
        <Tab.Screen name="Rooms" component={ManageRoomsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
