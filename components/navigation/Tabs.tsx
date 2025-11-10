// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useTheme } from 'heroui-native';

export interface TabItem {
  key: string;
  label: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (key: string) => void;
  scrollable?: boolean;
}

export function Tabs({ tabs, value, onChange, scrollable = true }: TabsProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.tabRow, scrollable && { gap: 12 }]}> 
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            onPress={() => !tab.disabled && onChange(tab.key)}
            disabled={tab.disabled}
            style={[
              styles.tab,
              {
                backgroundColor: active ? colors.accent : 'rgba(148,163,184,0.15)',
                opacity: tab.disabled ? 0.5 : 1,
              },
            ]}
          >
            <Text
              style={{
                color: active ? colors.accentForeground : colors.foreground,
                fontWeight: active ? '700' : '600',
              }}
            >
              {tab.label}
            </Text>
            {tab.badge != null ? (
              <View
                style={{
                  marginLeft: 8,
                  backgroundColor: active ? colors.accentForeground : colors.foreground,
                  borderRadius: 999,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: active ? colors.accent : colors.background,
                  }}
                >
                  {tab.badge}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );

  if (!scrollable) {
    return content;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabScroll: {
    paddingVertical: 2,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
});


