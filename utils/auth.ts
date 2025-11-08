/**
 * Authentication Utility Functions
 * Created by Kien AI (leejungkiin@gmail.com)
 */

/**
 * Check if login is required based on environment variable
 * @returns true if login is required, false otherwise
 * Defaults to true if EXPO_PUBLIC_REQUIRE_LOGIN is not set
 */
export function isLoginRequired(): boolean {
  const requireLogin = process.env.EXPO_PUBLIC_REQUIRE_LOGIN;
  
  // Debug logging
  if (__DEV__) {
    console.log('[isLoginRequired] EXPO_PUBLIC_REQUIRE_LOGIN:', requireLogin);
    console.log('[isLoginRequired] Type:', typeof requireLogin);
  }
  
  // If not set, default to true (require login by default)
  if (requireLogin === undefined || requireLogin === null) {
    if (__DEV__) {
      console.log('[isLoginRequired] Variable not set, defaulting to true');
    }
    return true;
  }
  
  // Case-insensitive comparison
  const result = requireLogin.toLowerCase() !== 'false';
  if (__DEV__) {
    console.log('[isLoginRequired] Result:', result);
  }
  
  return result;
}

