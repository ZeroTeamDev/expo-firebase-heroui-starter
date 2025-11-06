/**
 * Analytics wrapper (placeholder)
 * Created by Kien AI (leejungkiin@gmail.com)
 */

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function logEvent(name: string, params?: AnalyticsParams) {
  // Placeholder to avoid native dependency requirement in managed workflow
  // Integrate expo-firebase-analytics or Segment as needed
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] ${name}`, params || {});
  }
}


