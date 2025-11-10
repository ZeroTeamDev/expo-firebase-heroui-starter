/**
 * Global Configuration Store
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Zustand store for global configuration state
 */

import { create } from 'zustand';
import {
  getGlobalConfig,
  subscribeToGlobalConfig,
  type GlobalConfig,
} from '@/services/config/global-config.service';

interface ConfigState {
  config: GlobalConfig | null;
  loading: boolean;
  error: Error | null;
  initialized: boolean;
}

interface ConfigActions {
  setConfig: (config: GlobalConfig) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  initialize: () => Promise<void>;
  subscribe: () => () => void;
  refresh: () => Promise<void>;
}

type ConfigStore = ConfigState & ConfigActions;

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: null,
  loading: false,
  error: null,
  initialized: false,

  setConfig: (config) => set({ config, error: null }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error, loading: false }),

  initialize: async () => {
    const { initialized } = get();
    if (initialized) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const config = await getGlobalConfig();
      set({ config, loading: false, initialized: true, error: null });
    } catch (error) {
      set({
        error: error as Error,
        loading: false,
        initialized: true,
      });
    }
  },

  subscribe: () => {
    return subscribeToGlobalConfig((config, error) => {
      if (error) {
        get().setError(error);
      } else if (config) {
        get().setConfig(config);
      }
    });
  },

  refresh: async () => {
    set({ loading: true });
    try {
      const config = await getGlobalConfig();
      set({ config, loading: false, error: null });
    } catch (error) {
      set({
        error: error as Error,
        loading: false,
      });
    }
  },
}));

