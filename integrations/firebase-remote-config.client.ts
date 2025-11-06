/**
 * Firebase Remote Config Client (React Native Firebase)
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Wrapper for @react-native-firebase/remote-config
 */

import { Platform } from "react-native";

// Lazy import để tránh lỗi khi native module chưa ready
let remoteConfig: any = null;

/**
 * Get remote config instance (lazy load)
 */
function getRemoteConfigInstance() {
  if (Platform.OS === "web") {
    return null;
  }

  if (!remoteConfig) {
    try {
      // Try to require the module - this may throw if module not linked
      let module: any;
      try {
        // Suppress require error for cleaner console
        const originalError = console.error;
        console.error = () => {}; // Temporarily suppress errors
        try {
          module = require("@react-native-firebase/remote-config");
        } finally {
          console.error = originalError; // Restore
        }
      } catch (requireError: any) {
        // Module not available - this is expected if not rebuilt
        const errorMsg = requireError?.message || String(requireError);
        if (errorMsg.includes("Cannot find module") || errorMsg.includes("Native module") || errorMsg.includes("RNFBAppModule")) {
          // Expected - module not linked yet, return null silently
          remoteConfig = null;
          return null;
        }
        // Unexpected error - rethrow
        throw requireError;
      }

      remoteConfig = module?.default || module;
      
      // Test if it's actually available and working
      if (remoteConfig && typeof remoteConfig === "function") {
        try {
          const instance = remoteConfig();
          if (instance) {
            console.log("[Firebase Remote Config] ✅ Module loaded successfully");
            return remoteConfig;
          }
        } catch (testError: any) {
          // Handle runtime errors when trying to use the module
          const errorMsg = testError?.message || String(testError);
          
          if (errorMsg.includes("No Firebase App") || errorMsg.includes("has been created")) {
            // Firebase app not initialized
            remoteConfig = null;
            return null;
          } else if (errorMsg.includes("Native module") || testError?.code === "ERR_MODULE_NOT_FOUND") {
            // Native module not linked
            remoteConfig = null;
            return null;
          }
          // Other unexpected errors - return null but don't throw
          console.warn("[Firebase Remote Config] ⚠️ Module loaded but initialization failed:", errorMsg);
          remoteConfig = null;
          return null;
        }
      }
      
      // Module loaded but not in expected format
      if (!remoteConfig) {
        remoteConfig = null;
        return null;
      }
    } catch (error: any) {
      // Catch any other unexpected errors
      const errorMsg = error?.message || String(error);
      
      // Only log if it's not a "module not found" type error
      if (!errorMsg.includes("Cannot find module") && !errorMsg.includes("Native module")) {
        console.warn("[Firebase Remote Config] ⚠️ Unexpected error:", errorMsg);
      }
      
      remoteConfig = null;
      return null;
    }
  }
  
  return remoteConfig;
}

/**
 * Initialize Remote Config with defaults
 */
export async function initRemoteConfigDefaults(): Promise<void> {
  try {
    const rc = getRemoteConfigInstance();
    if (!rc) {
      throw new Error("React Native Firebase Remote Config not available");
    }

    const defaults = {
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

    await rc().setDefaults(defaults);
    console.log("[Firebase Remote Config] Defaults set:", Object.keys(defaults).length, "keys");
  } catch (error: any) {
    console.error("[Firebase Remote Config] Error setting defaults:", error);
    throw error;
  }
}

/**
 * Fetch Remote Config values
 */
export async function fetchRemoteConfigValues(): Promise<boolean> {
  try {
    const rc = getRemoteConfigInstance();
    if (!rc) {
      throw new Error("React Native Firebase Remote Config not available");
    }

    // Set fetch interval for development
    const isDev = __DEV__;
    await rc().setConfigSettings({
      minimumFetchIntervalMillis: isDev ? 0 : 3600000, // 0 for dev, 1 hour for prod
    });

    // Fetch and activate
    const activated = await rc().fetchAndActivate();
    
    if (activated) {
      console.log("[Firebase Remote Config] ✅ Fetched and activated new values");
    } else {
      console.log("[Firebase Remote Config] Using cached values");
    }
    
    return activated;
  } catch (error: any) {
    console.error("[Firebase Remote Config] Fetch error:", error);
    throw error;
  }
}

/**
 * Get all Remote Config values as object
 */
export function getAllRemoteConfigValues(): Record<string, string> {
  const rc = getRemoteConfigInstance();
  if (!rc) {
    return {};
  }

  const allValues = rc().getAll();
  const result: Record<string, string> = {};
  
  Object.keys(allValues).forEach((key) => {
    result[key] = allValues[key].asString();
  });
  
  return result;
}

/**
 * Get a specific Remote Config value
 */
export function getRemoteConfigValue(key: string, defaultValue: string = ""): string {
  const rc = getRemoteConfigInstance();
  if (!rc) {
    return defaultValue;
  }

  return rc().getValue(key).asString() || defaultValue;
}

/**
 * Check if Remote Config is available
 */
export function isRemoteConfigAvailable(): boolean {
  // Check if we're on native platform (not web)
  if (Platform.OS === "web") {
    return false;
  }
  
  try {
    // Try to get instance - this will return null if module not available
    const rc = getRemoteConfigInstance();
    return rc !== null && rc !== undefined;
  } catch (error) {
    // Silently return false if any error occurs
    return false;
  }
}

