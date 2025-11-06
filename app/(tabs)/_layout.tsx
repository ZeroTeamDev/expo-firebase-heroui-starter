import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Tabs } from "expo-router";
import { colorKit } from "heroui-native";

import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React, { useMemo } from "react";

import { useTheme } from "heroui-native";
import { useModules } from "@/hooks/use-modules";
import { GlassTabBar } from "@/components/layout/GlassTabBar";

export default function TabLayout() {
  const { colors, theme } = useTheme();
  const enabledModules = useModules();

  // Get icon name for module
  const getModuleIconName = (module: { icon?: { ios?: string; name?: string } }): string => {
    return module.icon?.ios || module.icon?.name || "circle";
  };

  // Track module IDs to avoid unnecessary re-renders
  const moduleIds = useMemo(
    () => enabledModules.map((m) => m.id).join(","),
    [enabledModules]
  );

  // Generate tab screens from enabled modules
  // Only recalculate when module IDs or colors change
  const moduleTabScreens = useMemo(() => {
    return enabledModules.map((module) => {
      const iconName = getModuleIconName(module);
      return (
        <Tabs.Screen
          name={module.route}
          key={module.id}
          options={{
            title: module.name,
            tabBarIcon: ({ color, size }) => <IconSymbol size={size} name={iconName} color={color} />,
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.surface1,
            },
            headerTintColor: colors.foreground,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleIds, colors.surface1, colors.foreground]);

  // Fallback to default tabs if no modules enabled - Create 5 tabs like the image
  if (enabledModules.length === 0) {
    return (
      <Tabs
        tabBar={(props) => <GlassTabBar {...props} />}
        screenOptions={{
          tabBarActiveTintColor: colorKit.HEX(colors.accent),
          tabBarInactiveTintColor: colorKit.HEX(colors.mutedForeground),
          headerShown: false,
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
            headerStyle: {
              backgroundColor: colors.surface1,
            },
            headerTintColor: colors.foreground,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <IconSymbol
                size={size}
                name="square.grid.2x2.fill"
                color={color}
              />
            ),
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.surface1,
            },
            headerTintColor: colors.foreground,
            headerTitleStyle: {
              fontWeight: "bold",
            },
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
            headerStyle: {
              backgroundColor: colors.surface1,
            },
            headerTintColor: colors.foreground,
            headerTitleStyle: {
              fontWeight: "bold",
            },
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
            headerStyle: {
              backgroundColor: colors.surface1,
            },
            headerTintColor: colors.foreground,
            headerTitleStyle: {
              fontWeight: "bold",
            },
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
            headerStyle: {
              backgroundColor: colors.surface1,
            },
            headerTintColor: colors.foreground,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colorKit.HEX(colors.accent),
        tabBarInactiveTintColor: colorKit.HEX(colors.mutedForeground),
        headerShown: false,
        // These styles are no longer needed as GlassTabBar handles its own styling.
        // Keeping them will cause layout conflicts.
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      {moduleTabScreens}
    </Tabs>
  );
}
