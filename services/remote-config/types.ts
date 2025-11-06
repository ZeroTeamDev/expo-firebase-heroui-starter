/**
 * Remote Config Type Definitions
 * Created by Kien AI (leejungkiin@gmail.com)
 */

/**
 * Feature flags configuration
 * Maps feature flag keys to boolean values
 */
export interface FeatureFlags {
  /**
   * Module feature flags
   * Format: module_{moduleName}_enabled
   */
  module_weather_enabled?: boolean;
  module_entertainment_enabled?: boolean;
  module_management_enabled?: boolean;
  module_ai_tools_enabled?: boolean;
  module_saas_enabled?: boolean;

  /**
   * AI feature flags
   */
  ai_chat_enabled?: boolean;
  ai_vision_enabled?: boolean;
  ai_speech_enabled?: boolean;

  /**
   * Theme/UI feature flags
   */
  theme_glass_effects_enabled?: boolean;
  theme_liquid_animations_enabled?: boolean;

  /**
   * Other feature flags
   */
  [key: string]: boolean | string | number | undefined;
}

/**
 * Remote Config value types
 */
export type RemoteConfigValue = string | number | boolean;

/**
 * Remote Config parameters
 */
export interface RemoteConfigParams {
  /**
   * Minimum fetch interval in milliseconds
   * Default: 3600000 (1 hour)
   */
  minimumFetchIntervalMillis?: number;

  /**
   * Fetch timeout in milliseconds
   * Default: 60000 (60 seconds)
   */
  fetchTimeoutMillis?: number;
}

/**
 * Remote Config fetch status
 */
export type FetchStatus = "noFetchYet" | "success" | "failure" | "throttle";

/**
 * Remote Config state
 */
export interface RemoteConfigState {
  /**
   * Feature flags
   */
  flags: FeatureFlags;
  /**
   * Last fetch timestamp
   */
  lastFetchTime: number | null;
  /**
   * Fetch status
   */
  fetchStatus: FetchStatus;
  /**
   * Loading state
   */
  loading: boolean;
  /**
   * Error message if any
   */
  error: string | null;
}

