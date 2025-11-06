/**
 * Remote Config Store
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Zustand store for managing Remote Config state and feature flags
 */

import { create } from "zustand";
import { FeatureFlags, FetchStatus } from "@/services/remote-config/types";

interface RemoteConfigState {
  /**
   * Feature flags
   */
  flags: FeatureFlags;
  /**
   * Last fetch timestamp
   */
  lastFetchTime: number | null;
  /**
   * Fetch status
   */
  fetchStatus: FetchStatus;
  /**
   * Loading state
   */
  loading: boolean;
  /**
   * Error message if any
   */
  error: string | null;
}

interface RemoteConfigActions {
  /**
   * Set feature flags
   */
  setFlags: (flags: FeatureFlags) => void;
  /**
   * Set last fetch time
   */
  setLastFetchTime: (timestamp: number | null) => void;
  /**
   * Set fetch status
   */
  setFetchStatus: (status: FetchStatus) => void;
  /**
   * Set loading state
   */
  setLoading: (loading: boolean) => void;
  /**
   * Set error
   */
  setError: (error: string | null) => void;
  /**
   * Get a feature flag value
   */
  getFlag: (key: string, defaultValue?: boolean) => boolean;
  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled: (key: string) => boolean;
  /**
   * Update flags from fetch
   */
  updateFlags: (flags: FeatureFlags) => void;
  /**
   * Reset store to initial state
   */
  reset: () => void;
}

type RemoteConfigStore = RemoteConfigState & RemoteConfigActions;

const initialState: RemoteConfigState = {
  flags: {},
  lastFetchTime: null,
  fetchStatus: "noFetchYet",
  loading: false,
  error: null,
};

export const useRemoteConfigStore = create<RemoteConfigStore>((set, get) => ({
  ...initialState,

  setFlags: (flags) =>
    set({
      flags,
      lastFetchTime: Date.now(),
    }),

  setLastFetchTime: (timestamp) =>
    set({
      lastFetchTime: timestamp,
    }),

  setFetchStatus: (status) =>
    set({
      fetchStatus: status,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  getFlag: (key, defaultValue = false) => {
    const state = get();
    const value = state.flags[key];
    if (typeof value === "boolean") {
      return value;
    }
    return defaultValue;
  },

  isFeatureEnabled: (key) => {
    const state = get();
    return state.getFlag(key, false);
  },

  updateFlags: (flags) =>
    set({
      flags,
      lastFetchTime: Date.now(),
      fetchStatus: "success",
      loading: false,
      error: null,
    }),

  reset: () => set(initialState),
}));

