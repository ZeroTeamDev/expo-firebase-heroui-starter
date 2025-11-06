// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ThemeView } from '@/components/theme-view';
import { useTheme } from 'heroui-native';
import { useModules } from '@/hooks/use-modules';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/glass/GlassCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getDefaultModuleIcon } from '@/modules/icon-map';
import { AppHeader } from '@/components/layout/AppHeader';

export default function ModulesHub() {
  const { colors } = useTheme();
  const modules = useModules();
  const router = useRouter();

  const openModule = (id: string) => router.push(`/modules/${id}` as any);

  return (
    <ThemeView className="flex-1 w-full">
      <AppHeader title="Modules" />

      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <Text style={{ color: colors.mutedForeground }}>Select a module to continue</Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {modules.map((m) => {
            const iconName = (m.icon as any) || (getDefaultModuleIcon(m.id as any) as any);
            return (
              <TouchableOpacity key={m.id} onPress={() => openModule(m.id)} activeOpacity={0.9}>
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
    </ThemeView>
  );
}


