/**
 * Analytics Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * React hooks for analytics with auto screen tracking
 */

import { useEffect, useCallback } from 'react';
import { usePathname, useSegments } from 'expo-router';
import {
  logEvent,
  logScreenView,
  setUserProperties,
  setUserId,
  logConversion,
  logPurchase,
  logAddToCart,
  logViewItem,
  logSearch,
  logShare,
  setAnalyticsEnabled,
  isAnalyticsEnabled,
  type AnalyticsParams,
  type EcommerceItem,
} from '@/services/firebase/analytics';

/**
 * Hook to automatically track screen views
 */
export function useScreenTracking(
  screenName?: string,
  params?: AnalyticsParams
): void {
  const pathname = usePathname();
  const segments = useSegments();

  useEffect(() => {
    const name = screenName || pathname || segments.join('/');
    if (name) {
      logScreenView(name, params);
    }
  }, [pathname, segments, screenName, JSON.stringify(params)]);
}

/**
 * Hook to track custom events
 */
export function useEventTracking() {
  const trackEvent = useCallback((eventName: string, params?: AnalyticsParams) => {
    logEvent(eventName, params);
  }, []);

  return { trackEvent };
}

/**
 * Hook to manage user properties
 */
export function useUserProperties() {
  const setProperties = useCallback((properties: Record<string, string>) => {
    setUserProperties(properties);
  }, []);

  const setProperty = useCallback((key: string, value: string) => {
    setUserProperties({ [key]: value });
  }, []);

  return { setProperties, setProperty };
}

/**
 * Hook to manage user ID
 */
export function useUserId() {
  const setUser = useCallback((userId: string | null) => {
    setUserId(userId);
  }, []);

  return { setUserId: setUser };
}

/**
 * Hook to track conversions
 */
export function useConversionTracking() {
  const trackConversion = useCallback(
    (conversionType: string, value?: number, currency?: string) => {
      logConversion(conversionType, value, currency);
    },
    []
  );

  return { trackConversion };
}

/**
 * Hook for e-commerce tracking
 */
export function useEcommerceTracking() {
  const trackPurchase = useCallback(
    (transactionId: string, value: number, currency: string, items: EcommerceItem[]) => {
      logPurchase(transactionId, value, currency, items);
    },
    []
  );

  const trackAddToCart = useCallback(
    (item: EcommerceItem, value?: number, currency?: string) => {
      logAddToCart(item, value, currency);
    },
    []
  );

  const trackViewItem = useCallback((item: EcommerceItem) => {
    logViewItem(item);
  }, []);

  return {
    trackPurchase,
    trackAddToCart,
    trackViewItem,
  };
}

/**
 * Hook for search tracking
 */
export function useSearchTracking() {
  const trackSearch = useCallback((searchTerm: string, params?: AnalyticsParams) => {
    logSearch(searchTerm, params);
  }, []);

  return { trackSearch };
}

/**
 * Hook for share tracking
 */
export function useShareTracking() {
  const trackShare = useCallback(
    (contentType: string, itemId: string, method?: string) => {
      logShare(contentType, itemId, method);
    },
    []
  );

  return { trackShare };
}

/**
 * Hook to manage analytics privacy settings
 */
export function useAnalyticsPrivacy() {
  const enable = useCallback(() => {
    setAnalyticsEnabled(true);
  }, []);

  const disable = useCallback(() => {
    setAnalyticsEnabled(false);
  }, []);

  const enabled = isAnalyticsEnabled();

  return { enable, disable, enabled };
}

