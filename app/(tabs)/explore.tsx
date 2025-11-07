import { ThemeView } from "@/components/theme-view";
import { useTheme } from "heroui-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useModules } from "@/hooks/use-modules";
import { GlassCard } from "@/components/glass/GlassCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getDefaultModuleIcon } from "@/modules/icon-map";
import { AIChip, AIStreaming } from "@/components/ai";

export default function MyComponent() {
  const { colors } = useTheme();
  const router = useRouter();
  const modules = useModules();

  return (
    <ThemeView className="flex-1 w-full">
      <ScrollView className="flex-1 p-4">
        <View className="mb-4">
          <Text
            style={{ color: colors.foreground }}
            className="text-3xl font-bold"
          >
            Explore
          </Text>
          <Text style={{ color: colors.mutedForeground }} className="mt-1">
            Quick access to enabled modules
          </Text>
        </View>

        <View className="mb-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text
              style={{ color: colors.foreground }}
              className="text-xl font-semibold"
            >
              Modules
            </Text>
            <TouchableOpacity onPress={() => router.push("/modules" as any)}>
              <Text style={{ color: colors.accent }}>See all →</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {modules.map((m) => {
              const iconName =
                (m.icon as any) || (getDefaultModuleIcon(m.id as any) as any);
              return (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => router.push(`/modules/${m.id}` as any)}
                  activeOpacity={0.9}
                >
                  <GlassCard
                    style={{
                      width: 160,
                      height: 120,
                      justifyContent: "center",
                    }}
                  >
                    <View style={{ gap: 10, alignItems: "flex-start" }}>
                      <IconSymbol
                        name={iconName}
                        color={colors.accent}
                        size={28}
                      />
                      <Text
                        style={{ color: colors.foreground, fontWeight: "600" }}
                      >
                        {m.title}
                      </Text>
                      <Text
                        style={{ color: colors.mutedForeground, fontSize: 12 }}
                        numberOfLines={1}
                      >
                        {m.routes?.[0]?.title || "Open"}
                      </Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* UI Previews */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text
              style={{ color: colors.foreground }}
              className="text-xl font-semibold"
            >
              Previews
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/modules/examples/ai-example" as any)}
            >
              <Text style={{ color: colors.accent }}>Open AI Examples →</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {/* AIChip Preview */}
            <GlassCard style={{ width: 160, padding: 12, gap: 10 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
                AIChip
              </Text>
              <AIChip size="sm" label="Hold to talk" />
            </GlassCard>

            {/* AIStreaming Preview */}
            <GlassCard style={{ width: 160, padding: 12, gap: 10 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
                AIStreaming
              </Text>
              <AIStreaming
                text={
                  "Hello! This is a preview of the assistant response with markdown support."
                }
                isStreaming={false}
                title="Preview"
              />
            </GlassCard>
          </View>
        </View>
      </ScrollView>
    </ThemeView>
  );
}
