import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { NotifierWrapper } from "react-native-notifier";
import "react-native-reanimated";
// gesture
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";

import "@/app/globals.css";

import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { useModuleStore } from "@/stores/moduleStore";
import { initRemoteConfig, fetchRemoteConfig } from "@/services/remote-config";
import { useRemoteConfigStore } from "@/stores/remoteConfigStore";
import { getFirebaseApp } from "@/integrations/firebase.client";
import AuthProvider, { useAuth } from "@/providers/AuthProvider";
import { isLoginRequired } from "@/utils/auth";
import { ToastProvider } from "@/components/feedback/Toast";
import { useNotificationStore } from "@/stores/notificationStore";
import { mockNotifications } from "@/app/modules/examples/notification-example/data";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {} as const;

function AppContent() {
  const initializeModules = useModuleStore((state) => state.initializeModules);
  const syncModulesWithRemoteConfig = useModuleStore(
    (state) => state.syncModulesWithRemoteConfig
  );
  const updateFlags = useRemoteConfigStore((state) => state.updateFlags);
  const setNotifications = useNotificationStore((state) => state.setNotifications);

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        // Initialize Firebase Web SDK first (needed for Firestore, Auth, etc.)
        // This ensures Firebase is ready before other services try to use it
        getFirebaseApp();
        
        // Initialize Remote Config
        await initRemoteConfig();

        // Fetch Remote Config values
        const featureFlags = await fetchRemoteConfig();
        
        if (!isMounted) return;
        updateFlags(featureFlags);

        // Initialize modules from registry
        initializeModules();

        // Sync modules with Remote Config feature flags
        syncModulesWithRemoteConfig(featureFlags);

        // Initialize notification store with mock data
        const notificationStore = useNotificationStore.getState();
        if (notificationStore.notifications.length === 0) {
          setNotifications(mockNotifications);
        }

        // Hide the splash screen
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("[AppContent] Initialization error:", error);
        if (!isMounted) return;
        // Even if Remote Config fails, still initialize modules
        initializeModules();
        
        // Initialize notification store even on error
        const notificationStore = useNotificationStore.getState();
        if (notificationStore.notifications.length === 0) {
          setNotifications(mockNotifications);
        }
        
        SplashScreen.hideAsync();
      }
    };

    initializeApp();

    // Cleanup function
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const { user, loading } = useAuth();
  const loginRequired = isLoginRequired();
  
  // Debug logging
  if (__DEV__) {
    console.log('[AppContent] User:', !!user, user?.email);
    console.log('[AppContent] Loading:', loading);
    console.log('[AppContent] Login Required:', loginRequired);
  }

  // If user is already logged in, redirect to home immediately
  // This ensures users with persisted sessions go straight to the app
  if (user) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    );
  }

  // If login is not required, allow access to main app without authentication
  if (!loginRequired) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    );
  }

  // While auth state is resolving and login is required, keep stack minimal
  // Only show loading when we don't have a user and login is required
  if (loading) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  // User is not logged in and login is required - show auth screens
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="auth" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <HeroUINativeProvider
          config={{
            colorScheme: "system",
            theme: {
              light: {
                colors: {
                  // Base colors
                  background: "#FFFFFF",
                  foreground: "#11181C",
                  default: "#FEFEFE",

                  // Semantic colors
                  surface: "#FFFFFF",
                  surfaceForeground: "#11181C",
                  panel: "#FFFFFF",

                  // Accent colors
                  accent: "#006FEE",
                  accentForeground: "#FFFFFF",

                  // Status colors
                  success: "#17C964",
                  successForeground: "#FFFFFF",
                  warning: "#F5A524",
                  warningForeground: "#000000",
                  danger: "#F31260",
                  dangerForeground: "#FFFFFF",

                  // Muted colors
                  muted: "#F4F4F5",
                  mutedForeground: "#71717A",

                  // Border and divider
                  border: "#E4E4E7",
                  divider: "#E4E4E7",

                  // Link
                  link: "#006FEE",

                  // Additional surfaces
                  surface1: "#FFFFFF",
                  surface2: "#F4F4F5",
                  surface3: "#E4E4E7",
                },
              },
              dark: {
                colors: {
                  // Base colors
                  background: "#000000",
                  foreground: "#ECEDEE",
                  default: "#121212", // Input non focused bg

                  // Semantic colors
                  surface: "#111111",
                  surfaceForeground: "#ECEDEE",
                  panel: "#111111",

                  // Accent colors
                  accent: "#006FEE",
                  accentForeground: "#FFFFFF",

                  // Status colors
                  success: "#17C964",
                  successForeground: "#FFFFFF",
                  warning: "#F5A524",
                  warningForeground: "#000000",
                  danger: "#F31260",
                  dangerForeground: "#FFFFFF",

                  // Muted colors
                  muted: "#191919",
                  mutedForeground: "#A1A1AA",

                  // Border and divider
                  border: "#27272A",
                  divider: "#27272A",

                  // Link
                  link: "#006FEE",

                  // Additional surfaces
                  surface1: "#080808",
                  surface2: "#191919",
                  surface3: "#27272A",
                },
              },
            },
          }}
        >
          <ToastProvider>
            <GestureHandlerRootView>
              <NotifierWrapper>
                <AuthProvider>
                  <AppContent />
                </AuthProvider>
              </NotifierWrapper>
            </GestureHandlerRootView>

            <StatusBar style="auto" />
          </ToastProvider>
        </HeroUINativeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
