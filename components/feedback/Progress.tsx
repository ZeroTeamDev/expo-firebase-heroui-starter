// Created by Kien AI (leejungkiin@gmail.com)
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from 'heroui-native';

export type ProgressVariant = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
  value?: number;
  min?: number;
  max?: number;
  label?: string;
  helperText?: string;
  showValue?: boolean;
  indeterminate?: boolean;
  variant?: ProgressVariant;
  size?: ProgressSize;
  shape?: 'linear' | 'circular';
  trackStyle?: ViewStyle;
  fillStyle?: ViewStyle;
  labelStyle?: TextStyle;
  helperTextStyle?: TextStyle;
}

type ThemeColors = {
  accent: string;
  [key: string]: string;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const DEFAULT_DURATION = 320;

export function Progress({
  value = 0,
  min = 0,
  max = 100,
  label,
  helperText,
  showValue = true,
  indeterminate = false,
  variant = 'accent',
  size = 'md',
  shape = 'linear',
  trackStyle,
  fillStyle,
  labelStyle,
  helperTextStyle,
}: ProgressProps) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const palette = useMemo(() => getVariantPalette(variant, isDark, colors), [variant, isDark, colors]);

  const clampedValue = Math.min(Math.max(value, min), max);
  const percent = ((clampedValue - min) / (max - min || 1)) * 100;

  const progressAnim = useRef(new Animated.Value(shape === 'linear' && indeterminate ? 40 : percent)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shape !== 'linear') {
      return;
    }

    if (indeterminate) {
      progressAnim.setValue(40);
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }

    shimmerAnim.stopAnimation();
    shimmerAnim.setValue(0);

    const animation = Animated.timing(progressAnim, {
      toValue: percent,
      duration: DEFAULT_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    animation.start();
    return () => animation.stop();
  }, [indeterminate, percent, progressAnim, shimmerAnim, shape]);

  useEffect(() => {
    if (shape !== 'circular') {
      return;
    }

    if (indeterminate) {
      progressAnim.setValue(70);
      const loop = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      loop.start();
      return () => loop.stop();
    }

    rotationAnim.stopAnimation(() => {
      rotationAnim.setValue(0);
    });

    const animation = Animated.timing(progressAnim, {
      toValue: percent,
      duration: DEFAULT_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    animation.start();
    return () => animation.stop();
  }, [indeterminate, percent, progressAnim, rotationAnim, shape]);

  const widthInterpolation = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-50%', '150%'],
  });

  const { height, borderRadius } = sizeMap[size];
  const { diameter, strokeWidth } = circularSizeMap[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });
  const spinRotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const headerValue = shape === 'linear' && showValue ? `${Math.round(percent)}%` : undefined;
  const circularValueLabel = shape === 'circular' && showValue && !indeterminate ? `${Math.round(percent)}%` : undefined;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <View style={styles.headerRow}>
          <Text style={[styles.label, { color: palette.labelColor }, labelStyle]}>{label}</Text>
          {headerValue ? <Text style={[styles.value, { color: palette.valueColor }]}>{headerValue}</Text> : null}
        </View>
      ) : null}

      {shape === 'linear' ? (
        <View
          style={[
            styles.track,
            {
              height,
              borderRadius,
              backgroundColor: palette.track,
            },
            trackStyle,
          ]}
        >
          {indeterminate ? (
            <Animated.View
              style={[
                styles.indeterminateFill,
                {
                  backgroundColor: palette.fill,
                  borderRadius,
                  transform: [{ translateX: shimmerTranslate }],
                },
                fillStyle,
              ]}
            />
          ) : (
            <Animated.View
              style={[
                styles.fill,
                {
                  width: widthInterpolation,
                  height,
                  borderRadius,
                  backgroundColor: palette.fill,
                },
                fillStyle,
              ]}
            />
          )}
        </View>
      ) : (
        <View style={styles.circularContainer}>
          <Animated.View
            style={[
              styles.circularSpinner,
              indeterminate ? { transform: [{ rotate: spinRotation }] } : undefined,
            ]}
          >
            <Svg width={diameter} height={diameter}>
              <Circle
                cx={diameter / 2}
                cy={diameter / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke={palette.track}
                fill="none"
              />
              <AnimatedCircle
                cx={diameter / 2}
                cy={diameter / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke={palette.fill}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
              />
            </Svg>
          </Animated.View>
          {circularValueLabel ? (
            <Text style={[styles.circularValue, { color: palette.valueColor }]}>{circularValueLabel}</Text>
          ) : null}
        </View>
      )}

      {helperText ? (
        <Text style={[styles.helperText, { color: palette.helperColor }, helperTextStyle]}>{helperText}</Text>
      ) : null}
    </View>
  );
}

function getVariantPalette(variant: ProgressVariant, isDark: boolean, colors: ThemeColors) {
  const fillDefault = colors.accent ?? '#6366f1';

  const palettes: Record<
    ProgressVariant,
    {
      fill: string;
      track: string;
      labelColor: string;
      valueColor: string;
      helperColor: string;
    }
  > = {
    accent: {
      fill: fillDefault,
      track: isDark ? 'rgba(79,70,229,0.25)' : 'rgba(79,70,229,0.18)',
      labelColor: isDark ? '#e0e7ff' : '#312e81',
      valueColor: isDark ? '#c7d2fe' : '#312e81',
      helperColor: isDark ? '#cbd5f5' : '#475569',
    },
    success: {
      fill: '#22c55e',
      track: isDark ? 'rgba(34,197,94,0.25)' : 'rgba(34,197,94,0.18)',
      labelColor: isDark ? '#bbf7d0' : '#166534',
      valueColor: isDark ? '#4ade80' : '#166534',
      helperColor: isDark ? '#bbf7d0' : '#047857',
    },
    warning: {
      fill: '#facc15',
      track: isDark ? 'rgba(250,204,21,0.3)' : 'rgba(250,204,21,0.2)',
      labelColor: isDark ? '#fef08a' : '#92400e',
      valueColor: isDark ? '#fde047' : '#c2410c',
      helperColor: isDark ? '#fed7aa' : '#b45309',
    },
    danger: {
      fill: '#ef4444',
      track: isDark ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.2)',
      labelColor: isDark ? '#fecaca' : '#7f1d1d',
      valueColor: isDark ? '#fca5a5' : '#991b1b',
      helperColor: isDark ? '#fecdd3' : '#9f1239',
    },
    info: {
      fill: '#3b82f6',
      track: isDark ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.18)',
      labelColor: isDark ? '#bfdbfe' : '#1d4ed8',
      valueColor: isDark ? '#bfdbfe' : '#1d4ed8',
      helperColor: isDark ? '#cbd5f5' : '#1e40af',
    },
    neutral: {
      fill: isDark ? '#e2e8f0' : '#1f2937',
      track: isDark ? 'rgba(148,163,184,0.25)' : 'rgba(148,163,184,0.2)',
      labelColor: isDark ? '#f8fafc' : '#0f172a',
      valueColor: isDark ? '#cbd5f5' : '#334155',
      helperColor: isDark ? '#cbd5f5' : '#475569',
    },
  };

  return palettes[variant];
}

const sizeMap: Record<ProgressSize, { height: number; borderRadius: number }> = {
  sm: { height: 6, borderRadius: 999 },
  md: { height: 10, borderRadius: 999 },
  lg: { height: 14, borderRadius: 12 },
};

const circularSizeMap: Record<ProgressSize, { diameter: number; strokeWidth: number }> = {
  sm: { diameter: 36, strokeWidth: 4 },
  md: { diameter: 48, strokeWidth: 5 },
  lg: { diameter: 64, strokeWidth: 6 },
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  indeterminateFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '45%',
  },
  circularContainer: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularSpinner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularValue: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
  },
});



