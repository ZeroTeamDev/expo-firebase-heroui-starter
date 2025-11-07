/**
 * Firebase Analytics Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Developer-friendly analytics abstraction with privacy compliance
 */

import { 
  getAnalytics, 
  isSupported,
  logEvent as firebaseLogEvent, 
  setUserProperties as firebaseSetUserProperties, 
  setUserId as firebaseSetUserId, 
  Analytics 
} from 'firebase/analytics';
import { getFirebaseApp } from '@/integrations/firebase.client';
import { Platform } from 'react-native';

let analyticsInstance: Analytics | null = null;
let analyticsInitPromise: Promise<Analytics | null> | null = null;
let hasWarnedAboutAnalyticsInitialization = false; // Track if we've already warned about Analytics not being initialized

/**
 * Get Analytics instance
 * Analytics only works on web, not on React Native
 */
function getAnalyticsInstance(): Promise<Analytics | null> {
  // Return cached instance immediately if available
  if (analyticsInstance) {
    return Promise.resolve(analyticsInstance);
  }

  // Analytics doesn't work on React Native (needs cookies/indexedDB)
  if (Platform.OS !== 'web') {
    return Promise.resolve(null);
  }

  // Return cached promise if initialization is in progress
  if (analyticsInitPromise) {
    return analyticsInitPromise;
  }

  // Start initialization
  analyticsInitPromise = (async () => {
    try {
      const app = getFirebaseApp();
      if (!app) {
        // Firebase not initialized yet, return null (will be retried later)
        return null;
      }

      // Check if Analytics is supported before initializing
      const supported = await isSupported();
      if (!supported) {
        // Analytics not supported (e.g., no cookies/indexedDB)
        return null;
      }

      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    } catch (error) {
      // Don't log warnings for Analytics - it's expected to not work on React Native
      // Only log if it's an unexpected error on web
      if (__DEV__ && Platform.OS === 'web' && !hasWarnedAboutAnalyticsInitialization) {
        console.warn('[Analytics] Failed to initialize Analytics:', error);
        hasWarnedAboutAnalyticsInitialization = true;
      }
      return null;
    } finally {
      // Clear promise after initialization completes
      analyticsInitPromise = null;
    }
  })();

  return analyticsInitPromise;
}

/**
 * Analytics event parameters
 */
export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

/**
 * Log an event
 */
export function logEvent(name: string, params?: AnalyticsParams): void {
  // Analytics doesn't work on React Native, so just log to console in dev
  if (Platform.OS !== 'web') {
  if (__DEV__) {
      console.log(`[Analytics] ${name}`, params || {});
    }
    return;
  }

  // On web, try to use Firebase Analytics
  getAnalyticsInstance()
    .then((analytics) => {
      if (analytics) {
        firebaseLogEvent(analytics, name, params);
      } else if (__DEV__) {
    console.log(`[Analytics] ${name}`, params || {});
  }
    })
    .catch((error) => {
      if (__DEV__) {
        console.error('[Analytics] Error logging event:', error);
      }
    });
}

/**
 * Log a screen view
 */
export function logScreenView(screenName: string, params?: AnalyticsParams): void {
  logEvent('screen_view', {
    screen_name: screenName,
    ...params,
  });
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, string>): void {
  // Analytics doesn't work on React Native
  if (Platform.OS !== 'web') {
    if (__DEV__) {
      console.log('[Analytics] Set user properties:', properties);
    }
    return;
  }

  // On web, try to use Firebase Analytics
  getAnalyticsInstance()
    .then((analytics) => {
      if (analytics) {
        firebaseSetUserProperties(analytics, properties);
      } else if (__DEV__) {
        console.log('[Analytics] Set user properties:', properties);
      }
    })
    .catch((error) => {
      if (__DEV__) {
        console.error('[Analytics] Error setting user properties:', error);
      }
    });
}

/**
 * Set user ID
 */
export function setUserId(userId: string | null): void {
  // Analytics doesn't work on React Native
  if (Platform.OS !== 'web') {
    if (__DEV__) {
      console.log('[Analytics] Set user ID:', userId);
    }
    return;
  }

  // On web, try to use Firebase Analytics
  getAnalyticsInstance()
    .then((analytics) => {
      if (analytics) {
        firebaseSetUserId(analytics, userId);
      } else if (__DEV__) {
        console.log('[Analytics] Set user ID:', userId);
      }
    })
    .catch((error) => {
      if (__DEV__) {
        console.error('[Analytics] Error setting user ID:', error);
      }
    });
}

/**
 * Log conversion event
 */
export function logConversion(conversionType: string, value?: number, currency?: string): void {
  logEvent('conversion', {
    conversion_type: conversionType,
    value,
    currency: currency || 'USD',
  });
}

/**
 * E-commerce event types
 */
export interface EcommerceItem {
  item_id: string;
  item_name: string;
  category?: string;
  quantity?: number;
  price?: number;
}

/**
 * Log e-commerce purchase
 */
export function logPurchase(transactionId: string, value: number, currency: string, items: EcommerceItem[]): void {
  logEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency,
    items: items.map((item) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      category: item.category,
      quantity: item.quantity || 1,
      price: item.price || 0,
    })),
  });
}

/**
 * Log add to cart
 */
export function logAddToCart(item: EcommerceItem, value?: number, currency?: string): void {
  logEvent('add_to_cart', {
    currency: currency || 'USD',
    value,
    items: [{
      item_id: item.item_id,
      item_name: item.item_name,
      category: item.category,
      quantity: item.quantity || 1,
      price: item.price || 0,
    }],
  });
}

/**
 * Log view item
 */
export function logViewItem(item: EcommerceItem): void {
  logEvent('view_item', {
    items: [{
      item_id: item.item_id,
      item_name: item.item_name,
      category: item.category,
      price: item.price || 0,
    }],
  });
}

/**
 * Log search
 */
export function logSearch(searchTerm: string, params?: AnalyticsParams): void {
  logEvent('search', {
    search_term: searchTerm,
    ...params,
  });
}

/**
 * Log share
 */
export function logShare(contentType: string, itemId: string, method?: string): void {
  logEvent('share', {
    content_type: contentType,
    item_id: itemId,
    method,
  });
}

/**
 * Privacy compliance - check if analytics is enabled
 */
let analyticsEnabled = true;

export function setAnalyticsEnabled(enabled: boolean): void {
  analyticsEnabled = enabled;
  if (!enabled) {
    // Clear user properties and ID when disabled
    setUserProperties({});
    setUserId(null);
  }
}

export function isAnalyticsEnabled(): boolean {
  return analyticsEnabled;
}

/**
 * Wrapper that respects privacy settings
 */
function logEventWithPrivacy(name: string, params?: AnalyticsParams): void {
  if (analyticsEnabled) {
    logEvent(name, params);
  }
}

// Export privacy-aware versions
export const logEventPrivate = logEventWithPrivacy;
export const logScreenViewPrivate = (screenName: string, params?: AnalyticsParams) => {
  if (analyticsEnabled) {
    logScreenView(screenName, params);
  }
};
