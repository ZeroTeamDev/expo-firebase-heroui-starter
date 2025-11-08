import { IconSymbol } from "@/components/ui/icon-symbol";
import { Redirect, Tabs } from "expo-router";
import { colorKit, useTheme } from "heroui-native";
import React from "react";
import { LiquidTabBar } from "@/components/layout/LiquidTabBar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAuthStore } from "@/stores/authStore";
// modules are now showcased inside screens, tabs are static

export default function TabLayout() {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // Always render static tabs; modules are accessed within screens
  return (
    <Tabs
      tabBar={(props) => <LiquidTabBar {...props} />}
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
        name="radio"
        options={{
          title: "Radio",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol
              size={size}
              name="antenna.radiowaves.left.and.right"
              color={color}
            />
          ),
          headerShown: true,
          header: () => <AppHeader title="Radio" />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="magnifyingglass" color={color} />
          ),
          headerShown: true,
          header: () => <AppHeader title="Search" showSearch={false} />,
        }}
      />
    </Tabs>
  );
}
