/**
 * Module Sync Hook
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Hook to sync modules with Remote Config feature flags
 */

import { useEffect } from "react";
import { useModuleStore } from "@/stores/moduleStore";
import { useRemoteConfigStore } from "@/stores/remoteConfigStore";
import { useRemoteConfig } from "./use-remote-config";

/**
 * Hook to automatically sync modules with Remote Config feature flags
 * Watches Remote Config changes and updates modules accordingly
 * @param autoFetch - Whether to automatically fetch Remote Config on mount
 */
export function useModuleSync(autoFetch: boolean = true) {
  const syncModulesWithRemoteConfig = useModuleStore(
    (state) => state.syncModulesWithRemoteConfig
  );
  const { flags, loading, status } = useRemoteConfig(autoFetch);

  useEffect(() => {
    // Sync modules when feature flags change
    if (status === "success" && flags) {
      syncModulesWithRemoteConfig(flags);
    }
  }, [flags, status, syncModulesWithRemoteConfig]);

  return {
    loading,
    status,
    synced: status === "success",
  };
}

