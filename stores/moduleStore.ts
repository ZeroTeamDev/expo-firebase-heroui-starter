// Created by Kien AI (leejungkiin@gmail.com)
import { create } from 'zustand';
import type { ModuleDefinition } from '../modules/types';
import { listModules } from '../modules';

interface ModuleState {
  enabledModules: ModuleDefinition[];
  setEnabledModules: (mods: ModuleDefinition[]) => void;
  initializeModules: () => void;
  syncModulesWithRemoteConfig: (flags: Record<string, unknown>) => void;
}

export const useModuleStore = create<ModuleState>((set) => ({
  enabledModules: [],
  setEnabledModules: (mods) => set({ enabledModules: mods }),
  initializeModules: () => set({ enabledModules: listModules() }),
  syncModulesWithRemoteConfig: (_flags) => {
    // TODO: read flags to filter modules. For now keep all initialized modules.
  },
}));
