import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function RoomDetailScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Room Detail</Text>
      <View style={{ height: 12 }} />
      <Text>History and charts will appear here.</Text>
    </ScrollView>
  );
}


