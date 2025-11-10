// Created by Kien AI (leejungkiin@gmail.com)
import { create } from 'zustand';
import type { ModuleDefinition } from '../modules/types';
import { listModules } from '../modules';
import { getGlobalConfig } from '@/services/config/global-config.service';
import { isModuleEnabled } from '@/services/config/global-config.service';

interface ModuleState {
  enabledModules: ModuleDefinition[];
  setEnabledModules: (mods: ModuleDefinition[]) => void;
  initializeModules: () => void;
  syncModulesWithRemoteConfig: (flags: Record<string, unknown>) => void;
  filterModulesByConfig: () => Promise<void>;
}

export const useModuleStore = create<ModuleState>((set, get) => ({
  enabledModules: [],
  setEnabledModules: (mods) => set({ enabledModules: mods }),
  initializeModules: () => set({ enabledModules: listModules() }),
  syncModulesWithRemoteConfig: async (_flags) => {
    // Filter modules based on global config
    await get().filterModulesByConfig();
  },
  filterModulesByConfig: async () => {
    try {
      const config = await getGlobalConfig();
      const allModules = listModules();
      
      // Filter modules based on global config
      const filteredModules = allModules.filter((module) => {
        // Check if module is enabled in config
        const isEnabled = config.enabledModules.includes(module.id) ||
                         config.moduleSettings[module.id]?.enabled === true;
        
        // If no explicit config, allow module (backward compatibility)
        if (config.enabledModules.length === 0 && !config.moduleSettings[module.id]) {
          return true;
        }
        
        return isEnabled;
      });
      
      set({ enabledModules: filteredModules });
    } catch (error) {
      if (__DEV__) {
        console.warn('[ModuleStore] Failed to filter modules by config:', error);
      }
      // Fallback to all modules on error
      set({ enabledModules: listModules() });
    }
  },
}));
