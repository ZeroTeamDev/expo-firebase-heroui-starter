/**
 * Module Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * React hooks for accessing module system
 */

import { useModuleStore } from "@/stores/moduleStore";
import { IModule } from "@/modules/types";

/**
 * Hook to get all enabled modules
 * @returns Array of enabled modules
 */
export function useModules(): IModule[] {
  // Use the cached enabledModules from store (computed in store to avoid re-renders)
  return useModuleStore((state) => state.enabledModules);
}

/**
 * Hook to get enabled module IDs
 * @returns Array of enabled module IDs
 */
export function useEnabledModuleIds(): string[] {
  return useModuleStore((state) => state.enabledModuleIds);
}

/**
 * Hook to get active module
 * @returns Active module or null
 */
export function useActiveModule(): IModule | null {
  const activeModuleId = useModuleStore((state) => state.activeModuleId);
  const modules = useModuleStore((state) => state.modules);

  if (!activeModuleId) return null;
  return modules[activeModuleId] || null;
}

/**
 * Hook to check if a module is enabled
 * @param moduleId - Module identifier
 * @returns True if module is enabled
 */
export function useIsModuleEnabled(moduleId: string): boolean {
  return useModuleStore((state) => state.enabledModuleIds.includes(moduleId));
}

/**
 * Hook to get module loading state
 * @returns True if modules are loading
 */
export function useModulesLoading(): boolean {
  return useModuleStore((state) => state.loading);
}

