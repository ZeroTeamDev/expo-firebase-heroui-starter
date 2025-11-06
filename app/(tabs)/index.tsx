import { ThemeView } from "@/components/theme-view";
import { Button, useTheme } from "heroui-native";
import { Text, View, TouchableOpacity } from "react-native";
import { logout } from "@/integrations/firebase.client";
import { useAuthStore } from "@/stores/authStore";
import { useModules } from "@/hooks/use-modules";
import { useRouter } from "expo-router";
import { GlassCard } from "@/components/glass/GlassCard";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getDefaultModuleIcon } from "@/modules/icon-map";

export default function HomeDashboard() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const modules = useModules();
  const router = useRouter();

  const handleOpenModule = (id: string) => {
    router.push(`/modules/${id}` as any);
  };

  return (
    <ThemeView className="flex-1 w-full" useSafeArea={false}>
      <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 }}>
        <Text style={{ color: colors.foreground }} className="text-2xl font-semibold">
          Welcome{user?.email ? `, ${user.email}` : ""}
        </Text>
        <Text style={{ color: colors.mutedForeground }} className="mt-1">
          Quick access to your modules
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {modules.map((m) => {
            const iconName = (m.icon as any) || (getDefaultModuleIcon(m.id as any) as any);
            return (
              <TouchableOpacity key={m.id} onPress={() => handleOpenModule(m.id)} activeOpacity={0.9}>
                <GlassCard style={{ width: 160, height: 120, justifyContent: "center" }}>
                  <View style={{ gap: 10, alignItems: "flex-start" }}>
                    <IconSymbol name={iconName} color={colors.accent} size={28} />
                    <Text style={{ color: colors.foreground, fontWeight: "600" }}>{m.title}</Text>
                    <Text style={{ color: colors.mutedForeground, fontSize: 12 }} numberOfLines={1}>
                      {m.routes?.[0]?.title || "Open"}
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ marginTop: "auto", padding: 16 }}>
        <Button variant="danger" onPress={() => logout()} className="w-full">
          Logout
        </Button>
      </View>
    </ThemeView>
  );
}
