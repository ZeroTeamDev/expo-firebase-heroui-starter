/**
 * Remote Config Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Service for managing Firebase Remote Config and feature flags.
 */

import { FeatureFlags, RemoteConfigParams } from "./types";
import {
  initRemoteConfigDefaults,
  fetchRemoteConfigValues,
  getAllRemoteConfigValues,
  getRemoteConfigValue,
  isRemoteConfigAvailable,
} from "@/integrations/firebase-remote-config.client";
import { Platform } from "react-native";

/**
 * Default/mock feature flags
 * These will be replaced with actual Remote Config values later
 */
const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  module_weather_enabled: false,
  module_entertainment_enabled: false,
  module_management_enabled: false,
  module_ai_tools_enabled: false,
  module_saas_enabled: false,
  ai_chat_enabled: false,
  ai_vision_enabled: false,
  ai_speech_enabled: false,
  theme_glass_effects_enabled: false,
  theme_liquid_animations_enabled: false,
};

/**
 * Remote Config Service Class
 */
class RemoteConfigService {
  private configParams: RemoteConfigParams;
  private isInitialized: boolean = false;
  private useFirebase: boolean = true;

  constructor(params?: RemoteConfigParams) {
    this.configParams = {
      minimumFetchIntervalMillis: params?.minimumFetchIntervalMillis || 3600000, // 1 hour
      fetchTimeoutMillis: params?.fetchTimeoutMillis || 60000, // 60 seconds
    };
  }

  /**
   * Initialize Remote Config
   * Uses @react-native-firebase/remote-config for React Native
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      console.log("[RemoteConfig] Already initialized");
      return;
    }

    // Check if React Native Firebase is available
    if (Platform.OS === "web") {
      console.log("[RemoteConfig] Running on web - using mock mode");
      console.log("[RemoteConfig] For web, consider using Firebase JS SDK");
      this.useFirebase = false;
      this.isInitialized = true;
      return;
    }

    // Try to initialize React Native Firebase Remote Config
    try {
      const isAvailable = isRemoteConfigAvailable();
      if (!isAvailable) {
        // This is expected if native modules not linked yet - fallback gracefully
        console.warn("[RemoteConfig] ⚠️ React Native Firebase not available - using mock mode");
        console.warn("[RemoteConfig] Run 'npx expo run:ios' to rebuild with native modules");
        this.useFirebase = false;
        this.isInitialized = true;
        return;
      }

      // Set defaults
      await initRemoteConfigDefaults();
      console.log("[RemoteConfig] ✅ Initialized with React Native Firebase");
      
      this.useFirebase = true;
      this.isInitialized = true;
    } catch (error: any) {
      // Expected error when native modules not linked - don't log as error
      const errorMsg = error?.message || String(error);
      if (errorMsg.includes("not available") || errorMsg.includes("Native module")) {
        console.warn("[RemoteConfig] ⚠️ Native modules not linked - using mock mode");
        console.warn("[RemoteConfig] Run 'npx expo run:ios' to rebuild with native modules");
      } else {
        // Unexpected error - log as error
        console.error("[RemoteConfig] ❌ Initialization error:", error);
        console.error("[RemoteConfig] Error details:", {
          message: error?.message,
          code: error?.code,
          name: error?.name,
        });
      }
      
      this.useFirebase = false;
      this.isInitialized = true;
    }
  }

  /**
   * Fetch Remote Config values from Firebase
   */
  async fetch(): Promise<FeatureFlags> {
    if (!this.isInitialized) {
      await this.init();
    }

    // Fallback to mock data if Firebase not available
    if (!this.useFirebase) {
      console.log("[RemoteConfig] Using mock data (Firebase not available)");
      return { ...DEFAULT_FEATURE_FLAGS };
    }

    try {
      // Fetch and activate Remote Config values using React Native Firebase
      const activated = await fetchRemoteConfigValues();
      
      if (activated) {
        console.log("[RemoteConfig] ✅ Fetched and activated new values from Firebase");
      } else {
        console.log("[RemoteConfig] Using cached values (no new values available)");
      }

      // Get all Remote Config values
      const allValues = getAllRemoteConfigValues();
      const flags: FeatureFlags = { ...DEFAULT_FEATURE_FLAGS }; // Start with defaults

      // Convert Remote Config values to FeatureFlags object
      Object.keys(allValues).forEach((key) => {
        const stringValue = allValues[key];
        try {
          // Try to parse as boolean first, then string, then number
          if (stringValue === "true" || stringValue === "false") {
            flags[key] = stringValue === "true";
          } else if (!isNaN(Number(stringValue)) && stringValue !== "") {
            flags[key] = Number(stringValue);
          } else if (stringValue !== "") {
            flags[key] = stringValue;
          }
        } catch (err) {
          console.warn(`[RemoteConfig] Error parsing value for ${key}:`, err);
        }
      });

      console.log("[RemoteConfig] ✅ Fetched from Firebase:", flags);
      return flags;
    } catch (error: any) {
      console.error("[RemoteConfig] ❌ Fetch error:", error?.message || error);
      console.warn("[RemoteConfig] Falling back to default values");
      
      // Return default flags on error
      return { ...DEFAULT_FEATURE_FLAGS };
    }
  }

  /**
   * Get feature flags
   * Returns current cached flags or fetches new ones
   */
  async getFeatureFlags(): Promise<FeatureFlags> {
    return await this.fetch();
  }

  /**
   * Get a specific feature flag value
   * @param key - Feature flag key
   * @param defaultValue - Default value if flag not found
   */
  async getValue(key: string, defaultValue: boolean = false): Promise<boolean> {
    if (!this.isInitialized) {
      await this.init();
    }

    // If using Firebase, get value directly
    if (this.useFirebase) {
      try {
        const stringValue = getRemoteConfigValue(key, String(defaultValue));
        
        if (stringValue === "true" || stringValue === "false") {
          return stringValue === "true";
        }
        return defaultValue;
      } catch (error) {
        console.error(`[RemoteConfig] Error getting value for ${key}:`, error);
        return defaultValue;
      }
    }

    // Fallback to flags object
    const flags = await this.getFeatureFlags();
    return (flags[key] as boolean) ?? defaultValue;
  }

  /**
   * Check if a feature flag is enabled
   * @param key - Feature flag key
   */
  async isFeatureEnabled(key: string): Promise<boolean> {
    return await this.getValue(key, false);
  }

  /**
   * Set default values (for testing/development)
   * Note: This only works in mock mode. For Firebase, set defaults in firebase.client.ts
   * @param flags - Feature flags to set as defaults
   */
  setDefaultValues(flags: Partial<FeatureFlags>): void {
    if (!this.useFirebase) {
      Object.assign(DEFAULT_FEATURE_FLAGS, flags);
      console.log("[RemoteConfig] Default values updated (mock mode):", flags);
    } else {
      console.warn("[RemoteConfig] Cannot set default values when using Firebase. Set defaults in Firebase Console or firebase.client.ts");
    }
  }
}

/**
 * Singleton instance
 */
let remoteConfigServiceInstance: RemoteConfigService | null = null;

/**
 * Get Remote Config service instance
 */
export function getRemoteConfigService(): RemoteConfigService {
  if (!remoteConfigServiceInstance) {
    remoteConfigServiceInstance = new RemoteConfigService();
  }
  return remoteConfigServiceInstance;
}

/**
 * Initialize Remote Config service
 */
export async function initRemoteConfig(params?: RemoteConfigParams): Promise<void> {
  const service = getRemoteConfigService();
  await service.init();
}

/**
 * Fetch Remote Config values
 */
export async function fetchRemoteConfig(): Promise<FeatureFlags> {
  const service = getRemoteConfigService();
  return await service.fetch();
}

/**
 * Get feature flags
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  const service = getRemoteConfigService();
  return await service.getFeatureFlags();
}

/**
 * Get a specific feature flag value
 */
export async function getFeatureFlag(key: string, defaultValue: boolean = false): Promise<boolean> {
  const service = getRemoteConfigService();
  return await service.getValue(key, defaultValue);
}

/**
 * Check if a feature is enabled
 */
export async function isFeatureEnabled(key: string): Promise<boolean> {
  const service = getRemoteConfigService();
  return await service.isFeatureEnabled(key);
}

/**
 * Set default values (for testing)
 */
export function setDefaultFeatureFlags(flags: Partial<FeatureFlags>): void {
  const service = getRemoteConfigService();
  service.setDefaultValues(flags);
}

