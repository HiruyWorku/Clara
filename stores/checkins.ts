import { create } from 'zustand';
import { createCheckin, getCheckinsByRoom } from '../lib/db';
import { formatISO } from 'date-fns';

// Simple ID generator for Expo Go compatibility
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export type CheckinsState = {
  byRoomId: Record<string, { id: string; date: string; isTidy: boolean; reason?: string | null }[]>;
  refreshRoom: (roomId: string) => Promise<void>;
  addCheckin: (params: { roomId: string; date: string; isTidy: boolean; reason?: string | null }) => Promise<void>;
};

export const useCheckinsStore = create<CheckinsState>((set, get) => ({
  byRoomId: {},
  refreshRoom: async (roomId) => {
    const rows = await getCheckinsByRoom(roomId);
    set((state) => ({
      byRoomId: {
        ...state.byRoomId,
        [roomId]: rows.map((r) => ({ id: r.id, date: r.date, isTidy: r.is_tidy === 1, reason: r.reason })),
      },
    }));
  },
  addCheckin: async ({ roomId, date, isTidy, reason }) => {
    await createCheckin({ id: generateId(), roomId, date, isTidy, reason: reason ?? null, createdAt: formatISO(new Date()) });
    await get().refreshRoom(roomId);
  },
}));


