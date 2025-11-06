// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";

import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import {
  getRemoteConfig,
  RemoteConfig,
  fetchAndActivate,
  getValue,
  getAll,
  activate,
  fetchConfig,
  isSupported,
} from "firebase/remote-config";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase - check if app already exists to avoid duplicate initialization
export const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence - check if auth already exists
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error: any) {
  // If auth already initialized, get the existing instance
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    throw error;
  }
}
export { auth };

export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Initialize Remote Config
let remoteConfig: RemoteConfig | null = null;

/**
 * Get Remote Config instance
 * Initializes Remote Config on first call
 */
export function getRemoteConfigInstance(): RemoteConfig {
  if (!remoteConfig) {
    try {
      console.log("[Firebase] Creating Remote Config instance...");
      remoteConfig = getRemoteConfig(app);
      console.log("[Firebase] Remote Config instance created successfully");

      // Set default Remote Config settings
      // For development, use shorter interval
      const isDev = __DEV__;
      remoteConfig.settings = {
        minimumFetchIntervalMillis: isDev ? 0 : 3600000, // 0 for dev (no cache), 1 hour for prod
        fetchTimeoutMillis: 60000, // 60 seconds
      };
      console.log("[Firebase] Remote Config settings configured:", remoteConfig.settings);

      // Note: setDefaults() is not available in Firebase JS SDK for React Native
      // Default values should be set in Firebase Console
      // The service will use defaults from Firebase Console or cached values
      console.log("[Firebase] Remote Config instance ready (defaults should be set in Firebase Console)");
    } catch (error: any) {
      console.error("[Firebase] Error creating Remote Config instance:", error);
      console.error("[Firebase] Error details:", {
        message: error?.message,
        code: error?.code,
        name: error?.name,
      });
      throw error;
    }
  }

  return remoteConfig;
}

/**
 * Check if Remote Config is supported
 */
export async function checkRemoteConfigSupport(): Promise<boolean> {
  try {
    return await isSupported();
  } catch (error) {
    console.error("[Firebase] Remote Config support check failed:", error);
    return false;
  }
}

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};

export const getToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  return token;
};
