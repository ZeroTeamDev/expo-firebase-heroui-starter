// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'heroui-native';

export type StepStatus = 'complete' | 'current' | 'upcoming';

export interface StepItem {
  id: string;
  title: string;
  description?: string;
  status?: StepStatus;
}

export interface StepperProps {
  steps: StepItem[];
  direction?: 'horizontal' | 'vertical';
}

export function Stepper({ steps, direction = 'horizontal' }: StepperProps) {
  const { colors } = useTheme();
  const isHorizontal = direction === 'horizontal';

  return (
    <View style={[isHorizontal ? styles.horizontal : styles.vertical]}>
      {steps.map((step, index) => {
        const status = step.status ?? 'upcoming';
        const isLast = index === steps.length - 1;
        const activeColor = status === 'complete' ? '#16a34a' : status === 'current' ? colors.accent : colors.mutedForeground || '#94a3b8';

        return (
          <View key={step.id} style={[styles.step, !isHorizontal && styles.stepVertical]}> 
            <View style={styles.iconRow}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: status === 'complete' ? '#bbf7d0' : status === 'current' ? colors.accent : 'transparent',
                  borderWidth: 2,
                  borderColor: activeColor,
                }}
              >
                <Text style={{ color: status === 'current' ? colors.accentForeground : activeColor, fontWeight: '700' }}>
                  {status === 'complete' ? '✓' : index + 1}
                </Text>
              </View>
              {!isLast && isHorizontal ? (
                <View style={[styles.connector, { borderColor: colors.border || 'rgba(148,163,184,0.25)' }]} />
              ) : null}
            </View>

            <View style={styles.stepContent}>
              <Text style={{ color: colors.foreground, fontWeight: status === 'current' ? '700' : '600' }}>{step.title}</Text>
              {step.description ? (
                <Text style={{ color: colors.mutedForeground || '#94a3b8', fontSize: 12 }}>{step.description}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  vertical: {
    flexDirection: 'column',
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepVertical: {
    flex: 1,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  connector: {
    flex: 1,
    borderTopWidth: 1,
    marginTop: 14,
    minWidth: 40,
  },
  stepContent: {
    flexShrink: 1,
    gap: 4,
  },
});


