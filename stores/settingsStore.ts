/**
 * Settings Store
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Zustand store for app settings and user preferences with local storage persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Notifications
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => void;

  // Privacy
  profileVisible: boolean;
  setProfileVisible: (visible: boolean) => void;
  dataSharing: boolean;
  setDataSharing: (sharing: boolean) => void;

  // Utilities
  resetSettings: () => void;
}

const defaultSettings = {
  theme: 'system' as ThemeMode,
  notificationsEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  profileVisible: true,
  dataSharing: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Theme
      theme: defaultSettings.theme,
      setTheme: (theme) => set({ theme }),

      // Notifications
      notificationsEnabled: defaultSettings.notificationsEnabled,
      setNotificationsEnabled: (enabled) => {
        set((state) => ({
          notificationsEnabled: enabled,
          // Automatically disable sound and vibration if notifications are disabled
          soundEnabled: enabled ? state.soundEnabled : false,
          vibrationEnabled: enabled ? state.vibrationEnabled : false,
        }));
      },

      soundEnabled: defaultSettings.soundEnabled,
      setSoundEnabled: (enabled) => {
        set((state) => ({
          // Disable sound if notifications are disabled
          soundEnabled: state.notificationsEnabled ? enabled : false,
        }));
      },

      vibrationEnabled: defaultSettings.vibrationEnabled,
      setVibrationEnabled: (enabled) => {
        set((state) => ({
          // Disable vibration if notifications are disabled
          vibrationEnabled: state.notificationsEnabled ? enabled : false,
        }));
      },

      // Privacy
      profileVisible: defaultSettings.profileVisible,
      setProfileVisible: (visible) => set({ profileVisible: visible }),

      dataSharing: defaultSettings.dataSharing,
      setDataSharing: (sharing) => set({ dataSharing: sharing }),

      // Utilities
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        notificationsEnabled: state.notificationsEnabled,
        soundEnabled: state.soundEnabled,
        vibrationEnabled: state.vibrationEnabled,
        profileVisible: state.profileVisible,
        dataSharing: state.dataSharing,
      }),
    }
  )
);

