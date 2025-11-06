/**
 * Remote Config Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * React hooks for accessing Remote Config and feature flags
 */

import { useEffect } from "react";
import { useRemoteConfigStore } from "@/stores/remoteConfigStore";
import { FeatureFlags, FetchStatus } from "@/services/remote-config/types";
import {
  fetchRemoteConfig,
  getFeatureFlag,
  isFeatureEnabled as checkFeatureEnabled,
} from "@/services/remote-config";

/**
 * Hook to get all feature flags
 * @returns Feature flags object
 */
export function useFeatureFlags(): FeatureFlags {
  return useRemoteConfigStore((state) => state.flags);
}

/**
 * Hook to get a specific feature flag value
 * @param key - Feature flag key
 * @param defaultValue - Default value if flag not found
 * @returns Feature flag value
 */
export function useFeatureFlag(key: string, defaultValue: boolean = false): boolean {
  const getFlag = useRemoteConfigStore((state) => state.getFlag);
  return getFlag(key, defaultValue);
}

/**
 * Hook to check if a feature is enabled
 * @param key - Feature flag key
 * @returns True if feature is enabled
 */
export function useIsFeatureEnabled(key: string): boolean {
  const isFeatureEnabled = useRemoteConfigStore((state) => state.isFeatureEnabled);
  return isFeatureEnabled(key);
}

/**
 * Hook to get Remote Config loading state
 * @returns True if Remote Config is loading
 */
export function useRemoteConfigLoading(): boolean {
  return useRemoteConfigStore((state) => state.loading);
}

/**
 * Hook to get Remote Config fetch status
 * @returns Fetch status
 */
export function useRemoteConfigStatus(): FetchStatus {
  return useRemoteConfigStore((state) => state.fetchStatus);
}

/**
 * Hook to get Remote Config error
 * @returns Error message or null
 */
export function useRemoteConfigError(): string | null {
  return useRemoteConfigStore((state) => state.error);
}

/**
 * Hook to fetch Remote Config values
 * Automatically fetches on mount and when dependencies change
 * @param dependencies - Dependencies to trigger refetch
 */
export function useFetchRemoteConfig(dependencies: any[] = []): void {
  const updateFlags = useRemoteConfigStore((state) => state.updateFlags);
  const setLoading = useRemoteConfigStore((state) => state.setLoading);
  const setError = useRemoteConfigStore((state) => state.setError);
  const setFetchStatus = useRemoteConfigStore((state) => state.setFetchStatus);

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      setFetchStatus("noFetchYet");

      try {
        const flags = await fetchRemoteConfig();
        updateFlags(flags);
        setFetchStatus("success");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        setFetchStatus("failure");
        console.error("[useFetchRemoteConfig] Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

/**
 * Hook to get Remote Config with automatic fetching
 * Combines fetching and state access
 * @param autoFetch - Whether to automatically fetch on mount
 * @returns Remote Config state and actions
 */
export function useRemoteConfig(autoFetch: boolean = true) {
  const flags = useFeatureFlags();
  const loading = useRemoteConfigLoading();
  const status = useRemoteConfigStatus();
  const error = useRemoteConfigError();
  const updateFlags = useRemoteConfigStore((state) => state.updateFlags);
  const setLoading = useRemoteConfigStore((state) => state.setLoading);
  const setError = useRemoteConfigStore((state) => state.setError);
  const setFetchStatus = useRemoteConfigStore((state) => state.setFetchStatus);

  useEffect(() => {
    if (autoFetch && status === "noFetchYet") {
      const fetchConfig = async () => {
        setLoading(true);
        setFetchStatus("noFetchYet");

        try {
          const fetchedFlags = await fetchRemoteConfig();
          updateFlags(fetchedFlags);
          setFetchStatus("success");
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          setError(errorMessage);
          setFetchStatus("failure");
          console.error("[useRemoteConfig] Error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchConfig();
    }
  }, [autoFetch, status, updateFlags, setLoading, setError, setFetchStatus]);

  const refetch = async () => {
    setLoading(true);
    setFetchStatus("noFetchYet");

    try {
      const fetchedFlags = await fetchRemoteConfig();
      updateFlags(fetchedFlags);
      setFetchStatus("success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setFetchStatus("failure");
      console.error("[useRemoteConfig] Refetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    flags,
    loading,
    status,
    error,
    refetch,
  };
}

