import { create } from 'zustand';
import { getSettings, updateSettings } from '../lib/db';

export type SettingsState = {
  notifyHour: number | null;
  notifyMin: number | null;
  voiceEnabled: boolean;
  sttEnabled: boolean;
  refresh: () => Promise<void>;
  setNotificationTime: (hour: number, min: number) => Promise<void>;
  setVoiceEnabled: (enabled: boolean) => Promise<void>;
  setSttEnabled: (enabled: boolean) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  notifyHour: null,
  notifyMin: null,
  voiceEnabled: true,
  sttEnabled: true,
  refresh: async () => {
    const s = await getSettings();
    if (s) {
      set({
        notifyHour: s.notify_hour ?? null,
        notifyMin: s.notify_min ?? null,
        voiceEnabled: s.voice_enabled === 1,
        sttEnabled: s.stt_enabled === 1,
      });
    }
  },
  setNotificationTime: async (hour, min) => {
    await updateSettings({ notify_hour: hour, notify_min: min });
    await get().refresh();
  },
  setVoiceEnabled: async (enabled) => {
    await updateSettings({ voice_enabled: enabled ? 1 : 0 });
    await get().refresh();
  },
  setSttEnabled: async (enabled) => {
    await updateSettings({ stt_enabled: enabled ? 1 : 0 });
    await get().refresh();
  },
}));


