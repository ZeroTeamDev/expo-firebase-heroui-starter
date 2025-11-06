// Created by Kien AI (leejungkiin@gmail.com)
import { useEffect } from 'react';
import { useModuleStore } from '../stores/moduleStore';

export function useModules() {
  const enabledModules = useModuleStore((s) => s.enabledModules);
  const initializeModules = useModuleStore((s) => s.initializeModules);

  useEffect(() => {
    // Ensure modules are populated from the registry once on mount
    if (enabledModules.length === 0) {
      initializeModules();
    }
  }, [enabledModules.length, initializeModules]);

  return enabledModules;
}
