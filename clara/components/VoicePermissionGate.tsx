import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function VoicePermissionGate() {
  const [status, setStatus] = useState<string>('unknown');

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setStatus(status);
    })();
  }, []);

  if (status !== 'granted') {
    return (
      <View style={{ padding: 8 }}>
        <Text style={{ color: '#6b7280' }}>Grant microphone and notifications permissions in Settings for best experience.</Text>
      </View>
    );
  }
  return null;
}


