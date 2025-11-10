// Created by Kien AI (leejungkiin@gmail.com)
import { useRemoteConfigStore } from '../stores/remoteConfigStore';
import type { FeatureFlags } from '../services/remote-config/types';

/**
 * Hook to get Remote Config flags from store
 * Flags are fetched once during app initialization in _layout.tsx
 * This hook just reads from the store to avoid multiple fetches
 */
export function useRemoteConfig(): FeatureFlags | null {
  const flags = useRemoteConfigStore((state) => state.flags);
  return flags;
}
