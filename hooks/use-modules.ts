// Created by Kien AI (leejungkiin@gmail.com)
import { useEffect, useRef } from 'react';
import { useModuleStore } from '../stores/moduleStore';
import { useRemoteConfig } from './use-remote-config';

export function useModules() {
  const enabledModules = useModuleStore((s) => s.enabledModules);
  const initializeModules = useModuleStore((s) => s.initializeModules);
  const syncModulesWithRemoteConfig = useModuleStore((s) => s.syncModulesWithRemoteConfig);
  const flags = useRemoteConfig();
  
  // Track if modules have been initialized to avoid re-initializing
  const initializedRef = useRef(false);
  
  // Track last synced flags to avoid re-syncing with same flags
  const lastSyncedFlagsRef = useRef<typeof flags>(null);

  useEffect(() => {
    // Ensure modules are populated from the registry once on mount
    if (!initializedRef.current && enabledModules.length === 0) {
      initializeModules();
      initializedRef.current = true;
    }
  }, [enabledModules.length, initializeModules]);

  useEffect(() => {
    // Only sync if flags have actually changed
    if (flags && flags !== lastSyncedFlagsRef.current) {
      syncModulesWithRemoteConfig(flags as unknown as Record<string, unknown>);
      lastSyncedFlagsRef.current = flags;
    }
  }, [flags, syncModulesWithRemoteConfig]);

  return enabledModules;
}
