/**
 * Configuration Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * React hooks for accessing global configuration
 */

import { useEffect, useMemo } from 'react';
import { useConfigStore } from '@/stores/configStore';
import type { GlobalConfig } from '@/services/config/global-config.service';

/**
 * Get global configuration
 */
export function useGlobalConfig(): {
  config: GlobalConfig | null;
  loading: boolean;
  error: Error | null;
} {
  const config = useConfigStore((state) => state.config);
  const loading = useConfigStore((state) => state.loading);
  const error = useConfigStore((state) => state.error);
  const initialize = useConfigStore((state) => state.initialize);
  const subscribe = useConfigStore((state) => state.subscribe);

  useEffect(() => {
    initialize();
    const unsubscribe = subscribe();
    return unsubscribe;
  }, [initialize, subscribe]);

  return { config, loading, error };
}

/**
 * Get specific config value
 */
export function useConfigValue<K extends keyof GlobalConfig>(
  key: K
): GlobalConfig[K] | undefined {
  const config = useConfigStore((state) => state.config);
  return config?.[key];
}

/**
 * Check if a feature is enabled
 */
export function useIsFeatureEnabled(feature: keyof GlobalConfig): boolean {
  const config = useConfigStore((state) => state.config);
  return Boolean(config?.[feature]);
}

/**
 * Check if module is enabled
 */
export function useModuleEnabled(moduleId: string): boolean {
  const config = useConfigStore((state) => state.config);
  if (!config) return false;
  
  return config.enabledModules.includes(moduleId) || 
         config.moduleSettings[moduleId]?.enabled === true;
}

/**
 * Get module settings
 */
export function useModuleSettings(moduleId: string): {
  enabled: boolean;
  settings?: Record<string, any>;
} | null {
  const config = useConfigStore((state) => state.config);
  if (!config) return null;
  
  return config.moduleSettings[moduleId] || null;
}

/**
 * Check if permissions are enabled
 */
export function usePermissionsEnabled(): boolean {
  return useIsFeatureEnabled('enablePermissions');
}

/**
 * Check if groups are enabled
 */
export function useGroupsEnabled(): boolean {
  return useIsFeatureEnabled('enableGroups');
}

/**
 * Check if file management is enabled
 */
export function useFileManagementEnabled(): boolean {
  return useIsFeatureEnabled('enableFileManagement');
}

/**
 * Get file upload limits
 */
export function useFileUploadLimits(): {
  maxFileSize: number;
  maxFileCount: number;
  maxFileCountWithGroup: number;
  allowedFileTypes: string[];
} {
  const maxFileSize = useConfigValue('maxFileSize') ?? 10485760;
  const maxFileCount = useConfigValue('maxFileCount') ?? 10;
  const maxFileCountWithGroup = useConfigValue('maxFileCountWithGroup') ?? 100;
  const allowedFileTypes = useConfigValue('allowedFileTypes') ?? [];

  return useMemo(
    () => ({
      maxFileSize,
      maxFileCount,
      maxFileCountWithGroup,
      allowedFileTypes,
    }),
    [maxFileSize, maxFileCount, maxFileCountWithGroup, allowedFileTypes]
  );
}

/**
 * Check if registration is enabled
 */
export function useRegistrationEnabled(): boolean {
  return useIsFeatureEnabled('enableRegistration');
}

/**
 * Check if maintenance mode is enabled
 */
export function useMaintenanceMode(): {
  enabled: boolean;
  message?: string;
} {
  const enabled = useIsFeatureEnabled('maintenanceMode');
  const message = useConfigValue('maintenanceMessage');

  return useMemo(
    () => ({
      enabled,
      message,
    }),
    [enabled, message]
  );
}

