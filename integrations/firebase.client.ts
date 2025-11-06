/**
 * Firebase Client Integration
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Firebase initialization and auth utilities
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signOut } from 'firebase/auth';

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

/**
 * Get Firebase app instance
 */
export function getFirebaseApp(): FirebaseApp {
  if (app) {
    return app;
  }

  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
    return app;
  }

  // Firebase config should be initialized by native modules
  // For web, you would need to provide config here
  // For now, return the first app or throw error
  if (apps.length === 0) {
    throw new Error('Firebase app not initialized. Make sure Firebase is configured in native code.');
  }

  app = apps[0];
  return app;
}

/**
 * Get Firebase Auth instance
 */
export function getAuthInstance(): Auth {
  if (authInstance) {
    return authInstance;
  }

  const firebaseApp = getFirebaseApp();
  authInstance = getAuth(firebaseApp);
  return authInstance;
}

/**
 * Export auth instance for direct use (lazy initialization)
 */
export const auth = (() => {
  try {
    return getAuthInstance();
  } catch {
    // Return a mock auth object if Firebase not initialized
    return {} as Auth;
  }
})();

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    const authInstance = getAuthInstance();
    await signOut(authInstance);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
