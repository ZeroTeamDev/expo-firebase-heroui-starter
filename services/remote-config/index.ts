// Created by Kien AI (leejungkiin@gmail.com)
import type { FeatureFlags } from './types';

let cached: Partial<FeatureFlags> = {};

export async function initRemoteConfig(): Promise<void> {
  // TODO: integrate Firebase Remote Config initialization
}

export async function fetchRemoteConfig(): Promise<FeatureFlags> {
  // TODO: wire to Firebase Remote Config. Placeholder values for now.
  cached = {
    module_weather_enabled: true,
    module_entertainment_enabled: true,
    module_management_enabled: true,
    module_ai_tools_enabled: true,
    module_saas_enabled: true,
    ai_rate_limit_per_minute: 60,
  };
  return cached as FeatureFlags;
}

export function getFlag<K extends keyof FeatureFlags>(key: K, fallback: FeatureFlags[K]): FeatureFlags[K] {
  if (cached[key] === undefined) return fallback;
  return cached[key] as FeatureFlags[K];
}
