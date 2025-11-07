/**
 * Module Sync Hook
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Hook to sync modules with Remote Config feature flags
 */

import { useEffect } from "react";
import { useModuleStore } from "@/stores/moduleStore";
import { useRemoteConfig } from "./use-remote-config";

/**
 * Hook to automatically sync modules with Remote Config feature flags
 * Watches Remote Config changes and updates modules accordingly
 * Note: Remote Config is fetched once during app initialization in _layout.tsx
 */
export function useModuleSync() {
  const syncModulesWithRemoteConfig = useModuleStore(
    (state) => state.syncModulesWithRemoteConfig
  );
  const flags = useRemoteConfig();

  useEffect(() => {
    // Sync modules when feature flags change
    if (flags) {
      syncModulesWithRemoteConfig(flags as unknown as Record<string, unknown>);
    }
  }, [flags, syncModulesWithRemoteConfig]);

  return {
    synced: flags !== null,
  };
}

