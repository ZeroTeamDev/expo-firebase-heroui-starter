/**
 * Module Registry
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Central registry for all application modules.
 * This file will be populated with module definitions in later steps.
 */

import { IModule, ModuleRegistry } from "./types";

/**
 * Module registry - maps module IDs to module instances
 * Initially empty, will be populated with actual modules
 */
export const moduleRegistry: ModuleRegistry = {};

/**
 * Initialize hardcoded modules
 * This will be replaced with dynamic module loading later
 */
function initializeModules(): void {
  // Home module
  registerModule({
    id: "home",
    name: "Home",
    description: "Home dashboard",
    route: "index",
    icon: {
      ios: "house.fill",
      name: "house",
    },
    enabled: true,
    enabledByDefault: true,
    permissions: {
      requiresAuth: true,
    },
  });

  // Explore module
  registerModule({
    id: "explore",
    name: "Explore",
    description: "Explore and discover",
    route: "explore",
    icon: {
      ios: "paperplane.fill",
      name: "paperplane",
    },
    enabled: true,
    enabledByDefault: true,
    permissions: {
      requiresAuth: true,
    },
  });

  // Weather module (disabled by default, will be enabled via Remote Config)
  registerModule({
    id: "weather",
    name: "Weather",
    description: "Weather information and forecasts",
    route: "weather",
    icon: {
      ios: "cloud.sun.fill",
      name: "cloud",
    },
    enabled: false,
    enabledByDefault: false,
    featureFlag: "module_weather_enabled",
    permissions: {
      requiresAuth: false,
    },
  });

  // Entertainment module (disabled by default)
  registerModule({
    id: "entertainment",
    name: "Entertainment",
    description: "Entertainment and media content",
    route: "entertainment",
    icon: {
      ios: "tv.fill",
      name: "tv",
    },
    enabled: false,
    enabledByDefault: false,
    featureFlag: "module_entertainment_enabled",
    permissions: {
      requiresAuth: false,
    },
  });
}

/**
 * Initialize modules on module load
 */
initializeModules();

/**
 * Get all modules from registry
 * @returns Array of all modules in registry
 */
export function getAllModules(): IModule[] {
  return Object.values(moduleRegistry);
}

/**
 * Get module by ID
 * @param moduleId - Module identifier
 * @returns Module instance or undefined if not found
 */
export function getModuleById(moduleId: string): IModule | undefined {
  return moduleRegistry[moduleId];
}

/**
 * Get enabled modules
 * @returns Array of enabled modules
 */
export function getEnabledModules(): IModule[] {
  return getAllModules().filter((module) => module.enabled);
}

/**
 * Register a module in the registry
 * @param module - Module instance to register
 */
export function registerModule(module: IModule): void {
  moduleRegistry[module.id] = module;
}

/**
 * Unregister a module from the registry
 * @param moduleId - Module identifier to unregister
 */
export function unregisterModule(moduleId: string): void {
  delete moduleRegistry[moduleId];
}

