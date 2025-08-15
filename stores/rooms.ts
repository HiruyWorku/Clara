import { create } from 'zustand';
import { createRoom, getRooms, updateRoomName, archiveRoom as archiveRoomDb, reorderRooms } from '../lib/db';
import { formatISO } from 'date-fns';

// Simple ID generator for Expo Go compatibility
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export type RoomState = {
  rooms: { id: string; name: string; emoji?: string | null }[];
  refresh: () => Promise<void>;
  addRoom: (name: string, emoji?: string | null) => Promise<void>;
  renameRoom: (roomId: string, name: string) => Promise<void>;
  archiveRoom: (roomId: string) => Promise<void>;
  reorder: (idsInOrder: string[]) => Promise<void>;
};

export const useRoomsStore = create<RoomState>((set, get) => ({
  rooms: [],
  refresh: async () => {
    try {
      console.log('🔄 Refreshing rooms...');
      const rows = await getRooms();
      console.log('📦 Retrieved rooms:', rows);
      set({ rooms: rows.map(r => ({ id: r.id, name: r.name, emoji: r.emoji })) });
    } catch (error) {
      console.error('❌ Failed to refresh rooms:', error);
    }
  },
  addRoom: async (name, emoji) => {
    try {
      console.log('➕ Adding room:', { name, emoji });
      const roomId = generateId();
      await createRoom({ id: roomId, name, emoji, created_at: formatISO(new Date()) });
      console.log('✅ Room created successfully:', roomId);
      await get().refresh();
    } catch (error) {
      console.error('❌ Failed to add room:', error);
    }
  },
  renameRoom: async (roomId, name) => {
    try {
      await updateRoomName(roomId, name);
      await get().refresh();
    } catch (error) {
      console.error('❌ Failed to rename room:', error);
    }
  },
  archiveRoom: async (roomId) => {
    try {
      await archiveRoomDb(roomId);
      await get().refresh();
    } catch (error) {
      console.error('❌ Failed to archive room:', error);
    }
  },
  reorder: async (idsInOrder) => {
    try {
      await reorderRooms(idsInOrder.map((id, idx) => ({ roomId: id, sort_order: idx })));
      await get().refresh();
    } catch (error) {
      console.error('❌ Failed to reorder rooms:', error);
    }
  },
}));


