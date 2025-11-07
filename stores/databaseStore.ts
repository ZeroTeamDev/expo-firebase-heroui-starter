/**
 * Database Store
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Zustand store for database cache management and offline sync
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  path: string;
}

interface OptimisticUpdate {
  id: string;
  path: string;
  type: 'create' | 'update' | 'delete';
  data?: any;
  timestamp: number;
}

interface DatabaseState {
  // Cache management
  cache: Map<string, CacheEntry>;
  setCache: <T>(path: string, data: T) => void;
  getCache: <T>(path: string) => T | null;
  clearCache: (path?: string) => void;
  clearAllCache: () => void;

  // Offline queue
  offlineQueue: OptimisticUpdate[];
  addToOfflineQueue: (update: Omit<OptimisticUpdate, 'id' | 'timestamp'>) => void;
  removeFromOfflineQueue: (id: string) => void;
  clearOfflineQueue: () => void;

  // Sync state
  isSyncing: boolean;
  setSyncing: (syncing: boolean) => void;
  lastSyncTime: number | null;
  setLastSyncTime: (time: number) => void;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useDatabaseStore = create<DatabaseState>()(
  persist(
    (set, get) => ({
      // Cache management
      cache: new Map(),

      setCache: <T>(path: string, data: T) => {
        set((state) => {
          const newCache = new Map(state.cache);
          newCache.set(path, {
            data,
            timestamp: Date.now(),
            path,
          });
          return { cache: newCache };
        });
      },

      getCache: <T>(path: string): T | null => {
        const state = get();
        const entry = state.cache.get(path);
        if (!entry) return null;

        // Check if cache is expired
        if (Date.now() - entry.timestamp > CACHE_TTL) {
          state.cache.delete(path);
          return null;
        }

        return entry.data as T;
      },

      clearCache: (path?: string) => {
        set((state) => {
          const newCache = new Map(state.cache);
          if (path) {
            newCache.delete(path);
          } else {
            newCache.clear();
          }
          return { cache: newCache };
        });
      },

      clearAllCache: () => {
        set({ cache: new Map() });
      },

      // Offline queue
      offlineQueue: [],

      addToOfflineQueue: (update: Omit<OptimisticUpdate, 'id' | 'timestamp'>) => {
        set((state) => ({
          offlineQueue: [
            ...state.offlineQueue,
            {
              ...update,
              id: `${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
            },
          ],
        }));
      },

      removeFromOfflineQueue: (id: string) => {
        set((state) => ({
          offlineQueue: state.offlineQueue.filter((update) => update.id !== id),
        }));
      },

      clearOfflineQueue: () => {
        set({ offlineQueue: [] });
      },

      // Sync state
      isSyncing: false,
      setSyncing: (syncing: boolean) => {
        set({ isSyncing: syncing });
      },

      lastSyncTime: null,
      setLastSyncTime: (time: number) => {
        set({ lastSyncTime: time });
      },
    }),
    {
      name: 'database-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist cache and offline queue
        cache: Array.from(state.cache.entries()),
        offlineQueue: state.offlineQueue,
        lastSyncTime: state.lastSyncTime,
      }),
      // Custom serialization for Map
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            cache: Array.from(state.state.cache.entries()),
          },
        });
      },
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            cache: new Map(parsed.state.cache || []),
          },
        };
      },
    }
  )
);

