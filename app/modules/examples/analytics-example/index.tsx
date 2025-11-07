/**
 * Analytics Example Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Demonstrates analytics tracking with examples
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { FormInput } from '@/components/forms/FormInput';
import { FormButton } from '@/components/forms/FormButton';
import { useScreenTracking } from '@/hooks/use-analytics';
import {
  useEventTracking,
  useUserProperties,
  useUserId,
  useConversionTracking,
  useEcommerceTracking,
  useSearchTracking,
  useShareTracking,
  useAnalyticsPrivacy,
} from '@/hooks/use-analytics';

export default function AnalyticsExampleScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  // Auto-track screen view
  useScreenTracking('analytics_example');

  const { trackEvent } = useEventTracking();
  const { setProperties, setProperty } = useUserProperties();
  const { setUserId } = useUserId();
  const { trackConversion } = useConversionTracking();
  const { trackPurchase, trackAddToCart, trackViewItem } = useEcommerceTracking();
  const { trackSearch } = useSearchTracking();
  const { trackShare } = useShareTracking();
  const { enable, disable, enabled } = useAnalyticsPrivacy();

  const [eventName, setEventName] = useState('');
  const [propertyKey, setPropertyKey] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [userIdInput, setUserIdInput] = useState('');

  const handleTrackEvent = () => {
    if (!eventName) {
      Alert.alert('Error', 'Please enter an event name');
      return;
    }
    trackEvent(eventName, { custom_param: 'value' });
    Alert.alert('Success', `Event "${eventName}" tracked`);
    setEventName('');
  };

  const handleSetProperty = () => {
    if (!propertyKey || !propertyValue) {
      Alert.alert('Error', 'Please enter both key and value');
      return;
    }
    setProperty(propertyKey, propertyValue);
    Alert.alert('Success', `Property "${propertyKey}" set to "${propertyValue}"`);
    setPropertyKey('');
    setPropertyValue('');
  };

  const handleSetUserId = () => {
    setUserId(userIdInput || null);
    Alert.alert('Success', `User ID set to: ${userIdInput || 'null'}`);
    setUserIdInput('');
  };

  const handleTrackConversion = () => {
    trackConversion('purchase', 99.99, 'USD');
    Alert.alert('Success', 'Conversion tracked');
  };

  const handleTrackPurchase = () => {
    trackPurchase(
      'txn_123',
      199.99,
      'USD',
      [
        { item_id: 'item1', item_name: 'Product 1', price: 99.99, quantity: 1 },
        { item_id: 'item2', item_name: 'Product 2', price: 100, quantity: 1 },
      ]
    );
    Alert.alert('Success', 'Purchase tracked');
  };

  const handleTrackAddToCart = () => {
    trackAddToCart(
      { item_id: 'item1', item_name: 'Product 1', price: 99.99, quantity: 1 },
      99.99,
      'USD'
    );
    Alert.alert('Success', 'Add to cart tracked');
  };

  const handleTrackViewItem = () => {
    trackViewItem({ item_id: 'item1', item_name: 'Product 1', price: 99.99 });
    Alert.alert('Success', 'View item tracked');
  };

  const handleTrackSearch = () => {
    trackSearch('laptop', { category: 'electronics' });
    Alert.alert('Success', 'Search tracked');
  };

  const handleTrackShare = () => {
    trackShare('article', 'article_123', 'twitter');
    Alert.alert('Success', 'Share tracked');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Analytics Examples" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy Settings */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>Privacy Settings</Text>
            <Text style={[styles.status, { color: colors.foreground }]}>
              Analytics: {enabled ? 'Enabled' : 'Disabled'}
            </Text>
            <View style={styles.buttonRow}>
              <FormButton
                title="Enable"
                onPress={enable}
                disabled={enabled}
                variant={enabled ? 'secondary' : 'primary'}
                style={styles.button}
              />
              <FormButton
                title="Disable"
                onPress={disable}
                disabled={!enabled}
                variant={enabled ? 'danger' : 'secondary'}
                style={styles.button}
              />
            </View>
          </Card.Body>
        </Card>

        {/* Event Tracking */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>Event Tracking</Text>
            <FormInput
              placeholder="Event name (e.g., button_click)"
              value={eventName}
              onChangeText={setEventName}
              containerStyle={styles.inputContainer}
            />
            <FormButton title="Track Event" onPress={handleTrackEvent} variant="primary" fullWidth />
          </Card.Body>
        </Card>

        {/* User Properties */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>User Properties</Text>
            <FormInput
              placeholder="Property key (e.g., user_type)"
              value={propertyKey}
              onChangeText={setPropertyKey}
              containerStyle={styles.inputContainer}
            />
            <FormInput
              placeholder="Property value (e.g., premium)"
              value={propertyValue}
              onChangeText={setPropertyValue}
              containerStyle={styles.inputContainer}
            />
            <FormButton title="Set Property" onPress={handleSetProperty} variant="primary" fullWidth />
          </Card.Body>
        </Card>

        {/* User ID */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>User ID</Text>
            <FormInput
              placeholder="User ID (leave empty to clear)"
              value={userIdInput}
              onChangeText={setUserIdInput}
              containerStyle={styles.inputContainer}
            />
            <FormButton title="Set User ID" onPress={handleSetUserId} variant="primary" fullWidth />
          </Card.Body>
        </Card>

        {/* Conversion Tracking */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>Conversion Tracking</Text>
            <FormButton title="Track Conversion" onPress={handleTrackConversion} variant="primary" fullWidth />
          </Card.Body>
        </Card>

        {/* E-commerce Tracking */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>E-commerce Tracking</Text>
            <FormButton title="Track Purchase" onPress={handleTrackPurchase} variant="secondary" fullWidth style={styles.buttonSpacing} />
            <FormButton title="Track Add to Cart" onPress={handleTrackAddToCart} variant="secondary" fullWidth style={styles.buttonSpacing} />
            <FormButton title="Track View Item" onPress={handleTrackViewItem} variant="secondary" fullWidth />
          </Card.Body>
        </Card>

        {/* Search Tracking */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>Search Tracking</Text>
            <FormButton title="Track Search" onPress={handleTrackSearch} variant="primary" fullWidth />
          </Card.Body>
        </Card>

        {/* Share Tracking */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>Share Tracking</Text>
            <FormButton title="Track Share" onPress={handleTrackShare} variant="primary" fullWidth />
          </Card.Body>
        </Card>
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
    gap: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  status: {
    fontSize: 14,
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
  buttonSpacing: {
    marginBottom: 8,
  },
});

