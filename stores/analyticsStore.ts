/**
 * Analytics Store
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Zustand store for analytics event queue and privacy compliance
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnalyticsParams } from '@/services/firebase/analytics';

interface QueuedEvent {
  id: string;
  name: string;
  params?: AnalyticsParams;
  timestamp: number;
}

interface AnalyticsState {
  // Event queue for offline
  eventQueue: QueuedEvent[];
  addToQueue: (name: string, params?: AnalyticsParams) => void;
  clearQueue: () => void;
  processQueue: () => void;

  // Privacy settings
  analyticsEnabled: boolean;
  setAnalyticsEnabled: (enabled: boolean) => void;
  userConsentGiven: boolean;
  setUserConsent: (consent: boolean) => void;

  // User properties cache
  userProperties: Record<string, string>;
  setUserProperties: (properties: Record<string, string>) => void;
  clearUserProperties: () => void;

  // User ID
  userId: string | null;
  setUserId: (userId: string | null) => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      // Event queue
      eventQueue: [],

      addToQueue: (name: string, params?: AnalyticsParams) => {
        set((state) => ({
          eventQueue: [
            ...state.eventQueue,
            {
              id: `${Date.now()}-${Math.random()}`,
              name,
              params,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      clearQueue: () => {
        set({ eventQueue: [] });
      },

      processQueue: () => {
        const { eventQueue } = get();
        // Process queue (this would be called when online)
        // Events would be sent to analytics service
        set({ eventQueue: [] });
      },

      // Privacy settings
      analyticsEnabled: true,
      setAnalyticsEnabled: (enabled: boolean) => {
        set({ analyticsEnabled: enabled });
      },

      userConsentGiven: false,
      setUserConsent: (consent: boolean) => {
        set({ userConsentGiven: consent });
        if (!consent) {
          // Clear all data when consent is withdrawn
          get().clearUserProperties();
          get().setUserId(null);
          get().clearQueue();
        }
      },

      // User properties
      userProperties: {},
      setUserProperties: (properties: Record<string, string>) => {
        set((state) => ({
          userProperties: { ...state.userProperties, ...properties },
        }));
      },

      clearUserProperties: () => {
        set({ userProperties: {} });
      },

      // User ID
      userId: null,
      setUserId: (userId: string | null) => {
        set({ userId });
      },
    }),
    {
      name: 'analytics-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        analyticsEnabled: state.analyticsEnabled,
        userConsentGiven: state.userConsentGiven,
        userProperties: state.userProperties,
        userId: state.userId,
        // Don't persist event queue
      }),
    }
  )
);

