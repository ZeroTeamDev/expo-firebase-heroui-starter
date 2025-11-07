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
  
  // If not set, default to true (require login by default)
  if (requireLogin === undefined) {
    return true;
  }
  
  // Case-insensitive comparison
  return requireLogin.toLowerCase() !== 'false';
}

