/**
 * Global Configuration Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Manages global application configuration stored in Firestore
 * Supports environment variable overrides and Firebase Remote Config sync
 */

import { readDocument, updateDocument, subscribeToDocument } from '@/services/firebase/database';
import type { DocumentData } from 'firebase/firestore';

export interface GlobalConfig {
  // Authentication
  enableRegistration: boolean;
  requireEmailVerification: boolean;
  
  // File Management
  enableFileManagement: boolean;
  maxFileSize: number; // in bytes
  maxFileCount: number; // max files per user without group
  maxFileCountWithGroup: number; // max files per user with group
  allowedFileTypes: string[]; // MIME types, empty = all
  
  // Modules
  enabledModules: string[];
  moduleSettings: {
    [moduleId: string]: {
      enabled: boolean;
      settings?: Record<string, any>;
    };
  };
  
  // Permissions
  enablePermissions: boolean;
  enableGroups: boolean;
  
  // System
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  
  // Metadata
  updatedBy: string;
  updatedAt: any; // Firestore timestamp
}

const CONFIG_PATH = 'config/global';

/**
 * Get default configuration from environment variables
 */
function getDefaultConfig(): GlobalConfig {
  const enabledModules = process.env.EXPO_PUBLIC_ENABLED_MODULES
    ? process.env.EXPO_PUBLIC_ENABLED_MODULES.split(',').map(m => m.trim())
    : [];

  return {
    enableRegistration: process.env.EXPO_PUBLIC_ENABLE_REGISTRATION !== 'false',
    requireEmailVerification: process.env.EXPO_PUBLIC_REQUIRE_EMAIL_VERIFICATION === 'true',
    enableFileManagement: process.env.EXPO_PUBLIC_ENABLE_FILE_MANAGEMENT !== 'false',
    maxFileSize: parseInt(process.env.EXPO_PUBLIC_MAX_FILE_SIZE || '10485760', 10),
    maxFileCount: parseInt(process.env.EXPO_PUBLIC_MAX_FILE_COUNT || '10', 10),
    maxFileCountWithGroup: parseInt(process.env.EXPO_PUBLIC_MAX_FILE_COUNT_WITH_GROUP || '100', 10),
    allowedFileTypes: [],
    enabledModules,
    moduleSettings: {},
    enablePermissions: process.env.EXPO_PUBLIC_ENABLE_PERMISSIONS === 'true',
    enableGroups: process.env.EXPO_PUBLIC_ENABLE_GROUPS === 'true',
    maintenanceMode: false,
    maintenanceMessage: undefined,
    updatedBy: 'system',
    updatedAt: new Date(),
  };
}

/**
 * Merge environment variables with Firestore config
 * Environment variables take precedence for development
 */
function mergeConfig(firestoreConfig: Partial<GlobalConfig> | null): GlobalConfig {
  const defaultConfig = getDefaultConfig();
  
  if (!firestoreConfig) {
    return defaultConfig;
  }
  
  // Merge configs, with Firestore taking precedence in production
  // In development, env vars can override
  const merged: GlobalConfig = {
    ...defaultConfig,
    ...firestoreConfig,
    // Always use env vars for these in development
    ...(__DEV__ ? {
      enablePermissions: process.env.EXPO_PUBLIC_ENABLE_PERMISSIONS === 'true' || firestoreConfig.enablePermissions || false,
      enableGroups: process.env.EXPO_PUBLIC_ENABLE_GROUPS === 'true' || firestoreConfig.enableGroups || false,
    } : {}),
  };
  
  return merged;
}

/**
 * Get global configuration from Firestore
 * Falls back to default config if not found
 */
export async function getGlobalConfig(): Promise<GlobalConfig> {
  try {
    const config = await readDocument<GlobalConfig>(CONFIG_PATH);
    return mergeConfig(config);
  } catch (error) {
    if (__DEV__) {
      console.warn('[GlobalConfig] Failed to load config from Firestore, using defaults:', error);
    }
    return getDefaultConfig();
  }
}

/**
 * Update global configuration (admin only)
 */
export async function updateGlobalConfig(
  updates: Partial<GlobalConfig>,
  updatedBy: string
): Promise<void> {
  const currentConfig = await getGlobalConfig();
  const newConfig: Partial<GlobalConfig> = {
    ...updates,
    updatedBy,
    updatedAt: new Date(),
  };
  
  await updateDocument(CONFIG_PATH, newConfig);
}

/**
 * Get specific config value
 */
export async function getConfigValue<K extends keyof GlobalConfig>(
  key: K
): Promise<GlobalConfig[K]> {
  const config = await getGlobalConfig();
  return config[key];
}

/**
 * Check if a feature is enabled
 */
export async function isFeatureEnabled(feature: keyof GlobalConfig): Promise<boolean> {
  const config = await getGlobalConfig();
  return Boolean(config[feature]);
}

/**
 * Get module settings
 */
export async function getModuleSettings(moduleId: string): Promise<{
  enabled: boolean;
  settings?: Record<string, any>;
} | null> {
  const config = await getGlobalConfig();
  return config.moduleSettings[moduleId] || null;
}

/**
 * Check if module is enabled
 */
export async function isModuleEnabled(moduleId: string): Promise<boolean> {
  const config = await getGlobalConfig();
  return config.enabledModules.includes(moduleId) || 
         config.moduleSettings[moduleId]?.enabled === true;
}

/**
 * Subscribe to global config changes
 */
export function subscribeToGlobalConfig(
  callback: (config: GlobalConfig | null, error?: Error) => void
): () => void {
  return subscribeToDocument<GlobalConfig>(CONFIG_PATH, (config, error) => {
    if (error) {
      callback(null, error);
      return;
    }
    callback(mergeConfig(config));
  });
}

/**
 * Sync with Firebase Remote Config (optional)
 * This can be implemented to sync with Firebase Remote Config for A/B testing
 */
export async function syncWithRemoteConfig(): Promise<void> {
  // TODO: Implement Firebase Remote Config sync
  // This would fetch remote config values and merge with Firestore config
  if (__DEV__) {
    console.log('[GlobalConfig] Remote Config sync not implemented yet');
  }
}

