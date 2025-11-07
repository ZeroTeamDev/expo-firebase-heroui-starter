/**
 * Analytics Service Abstraction
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Unified analytics interface
 */

// Re-export all analytics functions
export {
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
  logEventPrivate,
  logScreenViewPrivate,
  type AnalyticsParams,
  type EcommerceItem,
} from '../firebase/analytics';

// Re-export hooks
export {
  useScreenTracking,
  useEventTracking,
  useUserProperties,
  useUserId,
  useConversionTracking,
  useEcommerceTracking,
  useSearchTracking,
  useShareTracking,
  useAnalyticsPrivacy,
} from '../../hooks/use-analytics';

// Re-export store
export { useAnalyticsStore } from '../../stores/analyticsStore';

