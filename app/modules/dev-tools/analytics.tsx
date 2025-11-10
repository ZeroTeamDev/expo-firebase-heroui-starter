/**
 * Analytics Debugger Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * View analytics events in real-time
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';
import { FormButton } from '@/components/forms/FormButton';
import { DataCard } from '@/components/data';
import { logEvent, useAnalyticsStore } from '@/stores/analyticsStore';

interface AnalyticsEvent {
  name: string;
  params: Record<string, any>;
  timestamp: number;
}

export default function AnalyticsDebuggerScreen() {
  const { colors } = useTheme();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  // Subscribe to analytics store updates (if available)
  useEffect(() => {
    // This is a placeholder - you would need to implement event tracking
    // in the analytics store to capture events
    const interval = setInterval(() => {
      // Simulate event capture (replace with actual store subscription)
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTestEvent = () => {
    const testEvent: AnalyticsEvent = {
      name: 'test_event',
      params: {
        test_param: 'test_value',
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };
    
    logEvent(testEvent.name, testEvent.params);
    setEvents((prev) => [testEvent, ...prev].slice(0, 50)); // Keep last 50 events
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Analytics Debugger" subtitle="View analytics events in real-time" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card className="mb-4 rounded-xl">
          <Card.Body style={{ padding: 16, gap: 12 }}>
            <FormButton title="Log Test Event" onPress={handleTestEvent} />
            <Text style={[styles.info, { color: colors.mutedForeground }]}>
              Events logged: {events.length}
            </Text>
          </Card.Body>
        </Card>

        {events.length === 0 && (
          <Text style={[styles.empty, { color: colors.mutedForeground }]}>
            No events logged yet. Trigger some events or use the test button above.
          </Text>
        )}

        {events.map((event, index) => (
          <DataCard
            key={index}
            title={event.name}
            description={JSON.stringify(event.params, null, 2)}
            metadata={[
              { label: 'Timestamp', value: new Date(event.timestamp).toLocaleString() },
            ]}
            condensed
            style={{ marginBottom: 12 }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
  },
  empty: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
});

