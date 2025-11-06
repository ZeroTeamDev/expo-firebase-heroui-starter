/**
 * Module Store
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Zustand store for managing module state and enabled modules
 */

import { create } from "zustand";
import { IModule } from "@/modules/types";
import { getAllModules } from "@/modules";
import { FeatureFlags } from "@/services/remote-config/types";

interface ModuleState {
  /**
   * Enabled module IDs
   */
  enabledModuleIds: string[];
  /**
   * Active module ID (currently selected/viewed)
   */
  activeModuleId: string | null;
  /**
   * Module instances cache
   */
  modules: Record<string, IModule>;
  /**
   * Loading state
   */
  loading: boolean;
  /**
   * Cached enabled modules (computed property)
   */
  enabledModules: IModule[];
}

interface ModuleActions {
  /**
   * Set enabled module IDs
   */
  setEnabledModuleIds: (moduleIds: string[]) => void;
  /**
   * Enable a module
   */
  enableModule: (moduleId: string) => void;
  /**
   * Disable a module
   */
  disableModule: (moduleId: string) => void;
  /**
   * Set active module
   */
  setActiveModule: (moduleId: string | null) => void;
  /**
   * Set modules cache
   */
  setModules: (modules: Record<string, IModule>) => void;
  /**
   * Initialize modules from registry
   */
  initializeModules: () => void;
  /**
   * Set loading state
   */
  setLoading: (loading: boolean) => void;
  /**
   * Get enabled modules
   */
  getEnabledModules: () => IModule[];
  /**
   * Check if module is enabled
   */
  isModuleEnabled: (moduleId: string) => boolean;
  /**
   * Sync modules with Remote Config feature flags
   */
  syncModulesWithRemoteConfig: (featureFlags: FeatureFlags) => void;
}

type ModuleStore = ModuleState & ModuleActions;

export const useModuleStore = create<ModuleStore>((set, get) => ({
  enabledModuleIds: [],
  activeModuleId: null,
  modules: {},
  loading: false,
  enabledModules: [],

  setEnabledModuleIds: (moduleIds) => {
    const state = get();
    const enabledModules = moduleIds
      .map((id) => state.modules[id])
      .filter((module): module is IModule => module !== undefined);
    
    set({
      enabledModuleIds: moduleIds,
      enabledModules,
    });
  },

  enableModule: (moduleId) =>
    set((state) => {
      const alreadyEnabled = state.enabledModuleIds.includes(moduleId);
      if (alreadyEnabled) return state;

      const newEnabledIds = [...state.enabledModuleIds, moduleId];
      const module = state.modules[moduleId];
      const enabledModules = module
        ? [...state.enabledModules, module]
        : state.enabledModules;

      return {
        enabledModuleIds: newEnabledIds,
        enabledModules,
      };
    }),

  disableModule: (moduleId) =>
    set((state) => ({
      enabledModuleIds: state.enabledModuleIds.filter((id) => id !== moduleId),
      enabledModules: state.enabledModules.filter((m) => m.id !== moduleId),
      activeModuleId:
        state.activeModuleId === moduleId ? null : state.activeModuleId,
    })),

  setActiveModule: (moduleId) =>
    set({
      activeModuleId: moduleId,
    }),

  setModules: (modules) => {
    const state = get();
    const enabledModules = state.enabledModuleIds
      .map((id) => modules[id])
      .filter((module): module is IModule => module !== undefined);
    
    set({
      modules,
      enabledModules,
    });
  },

  initializeModules: () => {
    const allModules = getAllModules();
    const modulesMap: Record<string, IModule> = {};
    const enabledIds: string[] = [];

    allModules.forEach((module) => {
      modulesMap[module.id] = module;
      if (module.enabled) {
        enabledIds.push(module.id);
      }
    });

    const enabledModules = enabledIds
      .map((id) => modulesMap[id])
      .filter((module): module is IModule => module !== undefined);

    set({
      modules: modulesMap,
      enabledModuleIds: enabledIds,
      enabledModules,
    });
  },

  setLoading: (loading) =>
    set({
      loading,
    }),

  getEnabledModules: () => {
    const state = get();
    return state.enabledModuleIds
      .map((id) => state.modules[id])
      .filter((module): module is IModule => module !== undefined);
  },

  isModuleEnabled: (moduleId) => {
    const state = get();
    return state.enabledModuleIds.includes(moduleId);
  },

  syncModulesWithRemoteConfig: (featureFlags) => {
    const state = get();
    const allModules = getAllModules();
    const enabledIds: string[] = [];
    const updatedModules: Record<string, IModule> = { ...state.modules };

    allModules.forEach((module) => {
      let shouldBeEnabled = module.enabledByDefault ?? false;

      // Check feature flag if module has one
      if (module.featureFlag) {
        const flagValue = featureFlags[module.featureFlag];
        if (typeof flagValue === "boolean") {
          shouldBeEnabled = flagValue;
        }
      } else {
        // If no feature flag, use enabledByDefault
        shouldBeEnabled = module.enabledByDefault ?? false;
      }

      // Update module enabled status
      const updatedModule: IModule = {
        ...module,
        enabled: shouldBeEnabled,
        lastUpdated: Date.now(),
      };

      updatedModules[module.id] = updatedModule;

      if (shouldBeEnabled) {
        enabledIds.push(module.id);
      }
    });

    const enabledModules = enabledIds
      .map((id) => updatedModules[id])
      .filter((module): module is IModule => module !== undefined);

    set({
      modules: updatedModules,
      enabledModuleIds: enabledIds,
      enabledModules,
    });
  },
}));

