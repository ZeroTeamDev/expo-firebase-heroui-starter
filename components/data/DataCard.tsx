// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Platform } from 'react-native';
import { useTheme } from 'heroui-native';

export interface DataCardBadge {
  label: string;
  color?: string;
  textColor?: string;
}

export interface DataCardMetadataItem {
  label: string;
  value: string;
}

export interface DataCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  media?: React.ReactNode;
  badges?: DataCardBadge[];
  metadata?: DataCardMetadataItem[];
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  condensed?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export function DataCard({
  title,
  subtitle,
  description,
  media,
  badges,
  metadata,
  actions,
  footer,
  onPress,
  disabled = false,
  condensed = false,
  style,
  titleStyle,
}: DataCardProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const isWeb = Platform.OS === 'web';
  const containerPadding = isWeb ? (condensed ? 16 : 20) : condensed ? 12 : 16;
  const containerGap = isWeb ? (condensed ? 12 : 16) : condensed ? 10 : 12;

  const metadataGap = isWeb ? 16 : 12;

  const Container = onPress ? Pressable : View;
  const containerProps = onPress
    ? {
        onPress: disabled ? undefined : onPress,
        disabled,
      }
    : {};

  return (
    <Container
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(15,23,42,0.85)' : '#fff',
          borderColor: isDark ? 'rgba(148,163,184,0.14)' : 'rgba(148,163,184,0.25)',
          opacity: disabled ? 0.6 : 1,
          padding: containerPadding,
          gap: containerGap,
        },
        style,
      ]}
      {...containerProps}
    >
      {media ? <View style={styles.media}>{media}</View> : null}

      <View style={styles.header}> 
        <View style={styles.titleBlock}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#f8fafc' : '#0f172a' },
              titleStyle,
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {badges && badges.length > 0 ? (
          <View style={styles.badgeRow}>
            {badges.map((badge) => (
              <View
                key={`${badge.label}-${badge.color ?? 'default'}`}
                style={[
                  styles.badge,
                  {
                    backgroundColor: badge.color ?? (isDark ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.12)'),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeLabel,
                    { color: badge.textColor ?? (isDark ? '#cbd5f5' : '#4338ca') },
                  ]}
                >
                  {badge.label}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {description ? (
        <Text
          style={[styles.description, { color: isDark ? '#e2e8f0' : '#1f2937' }]}
          numberOfLines={condensed ? 3 : undefined}
        >
          {description}
        </Text>
      ) : null}

      {metadata && metadata.length > 0 ? (
        <View style={[styles.metadataGrid, { gap: metadataGap }]}>
          {metadata.map((item) => (
            <View key={item.label} style={styles.metadataItem}>
              <Text style={[styles.metadataLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>{item.label}</Text>
              <Text style={[styles.metadataValue, { color: isDark ? '#f8fafc' : '#0f172a' }]} numberOfLines={2}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {actions ? <View style={styles.actions}>{actions}</View> : null}

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
  },
  media: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metadataItem: {
    minWidth: 120,
    flex: 1,
    gap: 4,
  },
  metadataLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(148,163,184,0.2)',
    paddingTop: 12,
  },
});


