import { IconSymbol } from "@/components/ui/icon-symbol";
import { Redirect, Tabs } from "expo-router";
import { colorKit, useTheme } from "heroui-native";
import React from "react";
import { LiquidTabBar } from "@/components/layout/LiquidTabBar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAuthStore } from "@/stores/authStore";
import { isLoginRequired } from "@/utils/auth";
import { useIsAdmin } from "@/hooks/use-permissions";
import { useFileManagementEnabled, usePermissionsEnabled } from "@/hooks/use-config";
// modules are now showcased inside screens, tabs are static

export default function TabLayout() {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const loginRequired = isLoginRequired();
  const isAdmin = useIsAdmin();
  const permissionsEnabled = usePermissionsEnabled();
  const fileManagementEnabled = useFileManagementEnabled();

  // Debug logging
  if (__DEV__) {
    console.log('[TabLayout] User:', !!user, user?.email);
    console.log('[TabLayout] Login Required:', loginRequired);
  }

  // Only redirect to login if login is required and user is not logged in
  if (loginRequired && !user) {
    if (__DEV__) {
      console.log('[TabLayout] Redirecting to login (login required and no user)');
    }
    return <Redirect href="/auth/login" />;
  }

  // Always render static tabs; modules are accessed within screens
  // You can change tabBarTheme to: "blue", "pink", "red", "yellow", "green", "purple", "orange", "cyan", or "default"
  return (
    <Tabs
      tabBar={(props) => <LiquidTabBar {...props} tabBarTheme="blue" />}
      screenOptions={{
        tabBarActiveTintColor: colorKit.HEX(colors.accent),
        tabBarInactiveTintColor: colorKit.HEX(colors.mutedForeground),
        headerShown: false,
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTransparent: true,
        // These styles are no longer needed as GlassTabBar handles its own styling.
        // Keeping them will cause layout conflicts.
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="house.fill" color={color} />
          ),
          headerShown: true,
          header: () => <AppHeader title="Home" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="square.grid.2x2.fill" color={color} />
          ),
          headerShown: true,
          header: () => <AppHeader title="Explore" />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="star.fill" color={color} />
          ),
          headerShown: true,
          header: () => <AppHeader title="Discover" />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="clock" color={color} />
          ),
          headerShown: true,
          header: () => <AppHeader title="Activity" />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="music.note.list" color={color} />
          ),
          headerShown: true,
          header: () => <AppHeader title="Library" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="gear" color={color} />
          ),
          headerShown: true,
          header: () => <AppHeader title="Settings" />,
        }}
      />
      {(isAdmin || permissionsEnabled) && (
        <Tabs.Screen
          name="admin"
          options={{
            href: isAdmin ? undefined : null, // Hide from tab bar if not admin
            title: "Admin",
            tabBarIcon: ({ color, size }) => (
              <IconSymbol size={size} name="shield.fill" color={color} />
            ),
            headerShown: true,
            header: () => <AppHeader title="Admin" />,
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tab bar
          headerShown: true,
          header: () => <AppHeader title="Profile" />,
        }}
      />
      <Tabs.Screen
        name="radio"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
