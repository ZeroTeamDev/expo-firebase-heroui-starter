import { IconSymbol } from "@/components/ui/icon-symbol";
import { Tabs } from "expo-router";
import { colorKit, useTheme } from "heroui-native";
import React, { useMemo } from "react";
import { useModules } from "@/hooks/use-modules";
import { GlassTabBar } from "@/components/layout/GlassTabBar";
import { AppHeader } from "@/components/layout/AppHeader";

export default function TabLayout() {
  const { colors } = useTheme();
  const enabledModules = useModules();

  // Get icon name for module
  const getModuleIconName = (module: { icon?: string }): string => {
    return module.icon || "circle";
  };

  // Track module IDs to avoid unnecessary re-renders
  const moduleIds = useMemo(
    () => enabledModules.map((m) => m.id).join(","),
    [enabledModules]
  );

  // Generate tab screens from enabled modules
  // Only recalculate when module IDs change
  const moduleTabScreens = useMemo(() => {
    return enabledModules.flatMap((module) => {
      const iconName = getModuleIconName(module);
      // Create a tab for the first route of each module
      // In a full implementation, you might want to create tabs for all routes
      const firstRoute = module.routes[0];
      if (!firstRoute) return [];

      return (
        <Tabs.Screen
          name={firstRoute.path as any}
          key={module.id}
          options={{
            title: module.title,
            tabBarIcon: ({ color, size }) => (
              <IconSymbol size={size} name={iconName as any} color={color} />
            ),
            headerShown: true,
            header: () => <AppHeader title={module.title} />,
          }}
        />
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleIds]);

  // Fallback to default tabs if no modules enabled - Create 5 tabs like the image
  if (enabledModules.length === 0) {
    return (
      <Tabs
        tabBar={(props) => <GlassTabBar {...props} />}
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
              <IconSymbol
                size={size}
                name="square.grid.2x2.fill"
                color={color}
              />
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

  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
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
      {moduleTabScreens}
    </Tabs>
  );
}
