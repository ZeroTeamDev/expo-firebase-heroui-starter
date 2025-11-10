/**
 * Permission Store
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Zustand store for user permissions and role
 */

import { create } from 'zustand';
import {
  getUserRole,
  getUserProfile,
  getUserFileCount,
  getUserFileLimit,
  type UserProfile,
  type UserRole,
} from '@/services/permissions/permission.service';
import { useAuthStore } from './authStore';

interface PermissionState {
  role: UserRole | null;
  profile: UserProfile | null;
  fileCount: number;
  fileLimit: number;
  loading: boolean;
  error: Error | null;
}

interface PermissionActions {
  setRole: (role: UserRole) => void;
  setProfile: (profile: UserProfile) => void;
  setFileCount: (count: number) => void;
  setFileLimit: (limit: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  loadPermissions: (userId: string) => Promise<void>;
  refresh: (userId: string) => Promise<void>;
  reset: () => void;
}

type PermissionStore = PermissionState & PermissionActions;

export const usePermissionStore = create<PermissionStore>((set, get) => ({
  role: null,
  profile: null,
  fileCount: 0,
  fileLimit: 10,
  loading: false,
  error: null,

  setRole: (role) => set({ role }),
  
  setProfile: (profile) => set({ profile }),
  
  setFileCount: (count) => set({ fileCount: count }),
  
  setFileLimit: (limit) => set({ fileLimit: limit }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error, loading: false }),

  loadPermissions: async (userId: string) => {
    set({ loading: true, error: null });

    try {
      const [role, profile, fileCount, fileLimit] = await Promise.all([
        getUserRole(userId),
        getUserProfile(userId),
        getUserFileCount(userId),
        getUserFileLimit(userId),
      ]);

      set({
        role,
        profile,
        fileCount,
        fileLimit,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error as Error,
        loading: false,
      });
    }
  },

  refresh: async (userId: string) => {
    await get().loadPermissions(userId);
  },

  reset: () => {
    set({
      role: null,
      profile: null,
      fileCount: 0,
      fileLimit: 10,
      loading: false,
      error: null,
    });
  },
}));

