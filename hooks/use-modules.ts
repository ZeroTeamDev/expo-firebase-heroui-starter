// Created by Kien AI (leejungkiin@gmail.com)
import { useEffect } from 'react';
import { useModuleStore } from '../stores/moduleStore';
import { useRemoteConfig } from './use-remote-config';

export function useModules() {
  const enabledModules = useModuleStore((s) => s.enabledModules);
  const initializeModules = useModuleStore((s) => s.initializeModules);
  const syncModulesWithRemoteConfig = useModuleStore((s) => s.syncModulesWithRemoteConfig);
  const flags = useRemoteConfig();

  useEffect(() => {
    // Ensure modules are populated from the registry once on mount
    if (enabledModules.length === 0) {
      initializeModules();
    }
  }, [enabledModules.length, initializeModules]);

  useEffect(() => {
    if (flags) {
      syncModulesWithRemoteConfig(flags as unknown as Record<string, unknown>);
    }
  }, [flags, syncModulesWithRemoteConfig]);

  return enabledModules;
}
