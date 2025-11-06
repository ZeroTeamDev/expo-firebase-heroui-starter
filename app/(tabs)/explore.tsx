import { ThemeView } from "@/components/theme-view";
import { Button, useTheme } from "heroui-native";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useModules } from "@/hooks/use-modules";
import { GlassCard } from "@/components/glass/GlassCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getDefaultModuleIcon } from "@/modules/icon-map";

import { useAuthStore } from "@/stores/authStore";

export default function MyComponent() {
  const { toggleTheme, colors } = useTheme();
  const { user } = useAuthStore();
  const router = useRouter();
  const modules = useModules();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const credits = [
    {
      name: "Firebase",
      description: "Backend services and authentication",
      url: "https://firebase.google.com/",
    },
    {
      name: "HeroUI Native",
      description: "Beautiful React Native UI components",
      url: "https://github.com/heroui-inc/heroui-native",
    },
    {
      name: "Expo",
      description: "React Native development platform",
      url: "https://expo.dev/",
    },
    {
      name: "NativeWind",
      description: "Tailwind CSS for React Native",
      url: "https://www.nativewind.dev/",
    },
  ];

  return (
    <ThemeView className="flex-1 w-full">
      <ScrollView className="flex-1 p-4">
        <Text style={{ color: colors.foreground }} className="text-3xl font-bold mb-8">
          Let's Explore, {user?.displayName || "User"}
        </Text>

        {/* Modules section inline */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text style={{ color: colors.foreground }} className="text-xl font-semibold">
              Modules
            </Text>
            <TouchableOpacity onPress={() => router.push('/modules' as any)}>
              <Text style={{ color: colors.accent }}>See all →</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {modules.map((m) => {
              const iconName = (m.icon as any) || (getDefaultModuleIcon(m.id as any) as any);
              return (
                <TouchableOpacity key={m.id} onPress={() => router.push(`/modules/${m.id}` as any)} activeOpacity={0.9}>
                  <GlassCard style={{ width: 160, height: 120, justifyContent: 'center' }}>
                    <View style={{ gap: 10, alignItems: 'flex-start' }}>
                      <IconSymbol name={iconName} color={colors.accent} size={28} />
                      <Text style={{ color: colors.foreground, fontWeight: '600' }}>{m.title}</Text>
                      <Text style={{ color: colors.mutedForeground, fontSize: 12 }} numberOfLines={1}>
                        {m.routes?.[0]?.title || 'Open'}
                      </Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="flex-1 mb-8">
          <Text style={{ color: colors.foreground }} className="text-xl font-semibold mb-4">
            Built with ❤️ using:
          </Text>

          {credits.map((credit, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openLink(credit.url)}
              className="mb-4 p-4 rounded-lg border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface1,
              }}
            >
              <Text style={{ color: colors.foreground }} className="text-lg font-semibold">
                {credit.name}
              </Text>
              <Text style={{ color: colors.mutedForeground }} className="text-sm mt-1">
                {credit.description}
              </Text>
              <Text style={{ color: colors.accent }} className="text-xs mt-2">
                Tap to visit →
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="p-4">
        <Button variant="primary" onPress={() => toggleTheme()} className="w-full">
          Toggle Theme
        </Button>
      </View>
    </ThemeView>
  );
}
