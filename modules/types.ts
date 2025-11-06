/**
 * Module System Type Definitions
 * Created by Kien AI (leejungkiin@gmail.com)
 */

/**
 * Module icon configuration
 */
export interface ModuleIcon {
  /**
   * SF Symbol name for iOS
   */
  ios?: string;
  /**
   * Android drawable name
   */
  android?: string;
  /**
   * Fallback icon name (for web/expo)
   */
  name?: string;
}

/**
 * Module permissions configuration
 */
export interface ModulePermissions {
  /**
   * Whether authentication is required to access this module
   */
  requiresAuth?: boolean;
  /**
   * Required user roles (if any)
   */
  requiredRoles?: string[];
  /**
   * Feature flags that must be enabled
   */
  requiredFeatures?: string[];
}

/**
 * Module configuration interface
 */
export interface ModuleConfig {
  /**
   * Unique module identifier
   */
  id: string;
  /**
   * Display name of the module
   */
  name: string;
  /**
   * Short description of the module
   */
  description?: string;
  /**
   * Route path for the module (e.g., "weather", "entertainment")
   */
  route: string;
  /**
   * Icon configuration for the module
   */
  icon: ModuleIcon;
  /**
   * Permissions and access control
   */
  permissions?: ModulePermissions;
  /**
   * Whether the module is enabled by default
   */
  enabledByDefault?: boolean;
  /**
   * Remote Config feature flag key (e.g., "module_weather_enabled")
   */
  featureFlag?: string;
  /**
   * Module dependencies (other modules that must be enabled)
   */
  dependencies?: string[];
  /**
   * Module version
   */
  version?: string;
}

/**
 * Module instance interface
 */
export interface IModule extends ModuleConfig {
  /**
   * Whether the module is currently enabled
   */
  enabled: boolean;
  /**
   * Timestamp when module was last updated
   */
  lastUpdated?: number;
}

/**
 * Module registry type
 */
export type ModuleRegistry = Record<string, IModule>;

/**
 * Module filter options
 */
export interface ModuleFilterOptions {
  /**
   * Filter by enabled status
   */
  enabled?: boolean;
  /**
   * Filter by authentication requirement
   */
  requiresAuth?: boolean;
  /**
   * Filter by feature flag
   */
  featureFlag?: string;
}

