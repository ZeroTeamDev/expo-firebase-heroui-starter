/**
 * Firebase Client Integration
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Firebase initialization and auth utilities
 */

import {
  initializeApp,
  getApps,
  FirebaseApp,
  FirebaseOptions,
} from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  Auth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  User,
} from "firebase/auth";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let initializationAttempted = false;

/**
 * Get Firebase config from environment variables
 * For React Native, we need to initialize Firebase Web SDK with explicit config
 *
 * Required environment variables:
 * - EXPO_PUBLIC_FIREBASE_API_KEY
 * - EXPO_PUBLIC_FIREBASE_PROJECT_ID
 * - EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
 * - EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
 * - EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 * - EXPO_PUBLIC_FIREBASE_APP_ID
 *
 * Optional:
 * - EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID (only for web, not needed for React Native)
 * - EXPO_PUBLIC_FIREBASE_DATABASE_URL (for Realtime Database)
 */
function getFirebaseConfig(): FirebaseOptions | null {
  // Check required environment variables
  const requiredVars = [
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "EXPO_PUBLIC_FIREBASE_APP_ID",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    if (__DEV__) {
      console.error(
        "[Firebase] Missing required environment variables:",
        missingVars.join(", ")
      );
      console.error(
        "[Firebase] Please set these variables in your .env file or environment."
      );
      console.error(
        "[Firebase] You can get these values from Firebase Console → Project Settings → Your apps"
      );
    }
    return null;
  }

  // Build config from environment variables
  const config: FirebaseOptions = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
  };

  // Add optional fields if provided
  if (process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL) {
    config.databaseURL = process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL;
  }

  // Only include measurementId on web (Analytics doesn't work on React Native)
  if (
    Platform.OS === "web" &&
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
  ) {
    config.measurementId = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID;
  }

  if (__DEV__) {
    console.log(
      "[Firebase] Using EXPO_PUBLIC_* env config for project:",
      config.projectId
    );
  }

  return config;
}

/**
 * Initialize Firebase Web SDK
 * This is needed because Firebase Web SDK doesn't automatically detect
 * Firebase initialized from native code (React Native Firebase)
 */
function initializeFirebaseWebSDK(): FirebaseApp | null {
  if (initializationAttempted) {
    return app;
  }

  initializationAttempted = true;

  try {
    // Check if Firebase is already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
      return app;
    }

    // Get Firebase config
    const config = getFirebaseConfig();
    if (!config) {
      if (__DEV__) {
        console.error(
          "[Firebase] ❌ Firebase config not found. Please set EXPO_PUBLIC_FIREBASE_* environment variables."
        );
        console.error(
          "[Firebase] Required variables: EXPO_PUBLIC_FIREBASE_API_KEY, EXPO_PUBLIC_FIREBASE_PROJECT_ID, EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN, EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET, EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, EXPO_PUBLIC_FIREBASE_APP_ID"
        );
        console.error(
          "[Firebase] Get these values from Firebase Console → Project Settings → Your apps → Web app config"
        );
      }
      return null;
    }

    // Initialize Firebase Web SDK
    app = initializeApp(config);

    if (__DEV__) {
      console.log("[Firebase] ✅ Firebase Web SDK initialized successfully");
    }

    return app;
  } catch (error) {
    if (__DEV__) {
      console.error("[Firebase] Failed to initialize Firebase Web SDK:", error);
    }
    return null;
  }
}

/**
 * Get Firebase app instance
 * Automatically initializes Firebase Web SDK if not already initialized
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (app) {
    return app;
  }

  // Try to get existing app first
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    return app;
  }

  // Initialize Firebase Web SDK
  return initializeFirebaseWebSDK();
}

/**
 * Get Firebase Auth instance
 * Returns null if Firebase is not initialized yet (graceful handling)
 * Uses AsyncStorage for persistence on React Native
 */
export function getAuthInstance(): Auth | null {
  if (authInstance) {
    return authInstance;
  }

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    return null;
  }

  try {
    // On React Native, use initializeAuth with AsyncStorage for persistence
    if (Platform.OS !== "web") {
      try {
        // Try to initialize with AsyncStorage persistence
        authInstance = initializeAuth(firebaseApp, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
        if (__DEV__) {
          console.log(
            "[Firebase] Auth initialized with React Native persistence (AsyncStorage)"
          );
        }
      } catch (initError) {
        // If already initialized (e.g., getAuth was called elsewhere), just get it
        if (
          initError instanceof Error &&
          (initError.message.includes("already been initialized") ||
            initError.message.includes("already exists"))
        ) {
          authInstance = getAuth(firebaseApp);
          if (__DEV__) {
            console.log(
              "[Firebase] Auth already initialized, using existing instance"
            );
          }
        } else {
          throw initError;
        }
      }
    } else {
      // On web, use regular getAuth
      authInstance = getAuth(firebaseApp);
      if (__DEV__) {
        console.log("[Firebase] Auth initialized for web");
      }
    }
    return authInstance;
  } catch (error) {
    // If auth is already initialized, just get it
    if (
      error instanceof Error &&
      (error.message.includes("already been initialized") ||
        error.message.includes("already exists"))
    ) {
      try {
        authInstance = getAuth(firebaseApp);
        if (__DEV__) {
          console.log("[Firebase] Auth getAuth after init error");
        }
        return authInstance;
      } catch {
        // If getAuth also fails, return null
        return null;
      }
    }
    if (__DEV__) {
      console.error("[Firebase] Failed to initialize Auth:", error);
    }
    return null;
  }
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
    if (!authInstance) {
      if (__DEV__) {
        console.warn("[Firebase] Logout called but Auth is not initialized");
      }
      return;
    }
    await signOut(authInstance);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<User> {
  const authInstance = getAuthInstance();
  if (!authInstance) {
    throw new Error("[Firebase] Auth is not initialized");
  }
  const credential = await signInWithEmailAndPassword(
    authInstance,
    email,
    password
  );
  return credential.user;
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string): Promise<User> {
  const authInstance = getAuthInstance();
  if (!authInstance) {
    throw new Error("[Firebase] Auth is not initialized");
  }
  const credential = await createUserWithEmailAndPassword(
    authInstance,
    email,
    password
  );
  return credential.user;
}

/**
 * Sign in to Firebase using a Google ID token (from expo-auth-session)
 */
export async function signInWithGoogleIdToken(idToken: string): Promise<User> {
  const authInstance = getAuthInstance();
  if (!authInstance) {
    throw new Error("[Firebase] Auth is not initialized");
  }
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(authInstance, credential);
  return result.user;
}
