import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getRooms } from '../lib/db';
import { useRoomsStore } from '../stores/rooms';

export default function DebugInfo() {
  const [dbRooms, setDbRooms] = useState<any[]>([]);
  const storeRooms = useRoomsStore((s) => s.rooms);
  const refresh = useRoomsStore((s) => s.refresh);

  const loadDbRooms = async () => {
    try {
      const rooms = await getRooms();
      console.log('🔍 Debug: Direct DB query result:', rooms);
      setDbRooms(rooms);
    } catch (error) {
      console.error('🔍 Debug: DB query failed:', error);
    }
  };

  useEffect(() => {
    loadDbRooms();
  }, []);

  return (
    <View style={{ padding: 16, backgroundColor: '#f0f0f0', margin: 8, borderRadius: 8 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>🔍 Debug Info</Text>
      
      <TouchableOpacity onPress={loadDbRooms} style={{ backgroundColor: '#007AFF', padding: 8, borderRadius: 4, marginBottom: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Refresh DB Query</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={refresh} style={{ backgroundColor: '#34C759', padding: 8, borderRadius: 4, marginBottom: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Refresh Store</Text>
      </TouchableOpacity>
      
      <Text style={{ fontWeight: '600' }}>Store Rooms ({storeRooms.length}):</Text>
      <Text style={{ fontSize: 12, marginBottom: 8 }}>{JSON.stringify(storeRooms, null, 2)}</Text>
      
      <Text style={{ fontWeight: '600' }}>DB Rooms ({dbRooms.length}):</Text>
      <Text style={{ fontSize: 12 }}>{JSON.stringify(dbRooms, null, 2)}</Text>
    </View>
  );
}
