# Analytics Integration Guide

Created by Kien AI (leejungkiin@gmail.com)

## Quick Start

### 1. Import the hooks

```typescript
import { useScreenTracking, useEventTracking, logEvent } from '@/services/analytics';
```

### 2. Auto-track screen views

```typescript
function MyScreen() {
  // Automatically tracks screen view
  useScreenTracking('my_screen');
  
  return <View>...</View>;
}
```

### 3. Track custom events

```typescript
function MyComponent() {
  const { trackEvent } = useEventTracking();
  
  const handleButtonClick = () => {
    trackEvent('button_click', {
      button_name: 'submit',
      screen: 'home',
    });
  };
  
  return <Button onPress={handleButtonClick} title="Submit" />;
}
```

## API Reference

### Hooks

#### useScreenTracking

Automatically track screen views.

```typescript
useScreenTracking(screenName?: string, params?: AnalyticsParams);
```

#### useEventTracking

Track custom events.

```typescript
const { trackEvent } = useEventTracking();
trackEvent(eventName: string, params?: AnalyticsParams);
```

#### useUserProperties

Manage user properties.

```typescript
const { setProperties, setProperty } = useUserProperties();
setProperty('user_type', 'premium');
setProperties({ user_type: 'premium', plan: 'pro' });
```

#### useUserId

Set user ID.

```typescript
const { setUserId } = useUserId();
setUserId('user123');
```

#### useConversionTracking

Track conversions.

```typescript
const { trackConversion } = useConversionTracking();
trackConversion('purchase', 99.99, 'USD');
```

#### useEcommerceTracking

E-commerce tracking.

```typescript
const { trackPurchase, trackAddToCart, trackViewItem } = useEcommerceTracking();

trackPurchase('txn_123', 199.99, 'USD', [
  { item_id: 'item1', item_name: 'Product 1', price: 99.99, quantity: 1 },
]);

trackAddToCart({ item_id: 'item1', item_name: 'Product 1', price: 99.99 }, 99.99, 'USD');

trackViewItem({ item_id: 'item1', item_name: 'Product 1', price: 99.99 });
```

#### useSearchTracking

Track search events.

```typescript
const { trackSearch } = useSearchTracking();
trackSearch('laptop', { category: 'electronics' });
```

#### useShareTracking

Track share events.

```typescript
const { trackShare } = useShareTracking();
trackShare('article', 'article_123', 'twitter');
```

#### useAnalyticsPrivacy

Manage analytics privacy settings.

```typescript
const { enable, disable, enabled } = useAnalyticsPrivacy();
```

## Best Practices

### 1. Event Naming Conventions

Use snake_case for event names:
- `button_click`
- `screen_view`
- `purchase_completed`
- `user_signup`

### 2. Parameter Naming

Use consistent parameter names:
- `screen_name` for screen names
- `item_id` for item identifiers
- `category` for categories
- `value` for numeric values
- `currency` for currency codes

### 3. Privacy Compliance

Always respect user privacy:

```typescript
const { enabled, disable } = useAnalyticsPrivacy();

// Check if analytics is enabled before tracking
if (enabled) {
  trackEvent('user_action');
}

// Allow users to opt-out
<Button onPress={disable} title="Disable Analytics" />
```

### 4. Screen Tracking

Use descriptive screen names:

```typescript
// Good
useScreenTracking('product_detail', { product_id: '123' });

// Bad
useScreenTracking('screen1');
```

### 5. E-commerce Tracking

Track all e-commerce events:

```typescript
// View item
trackViewItem({ item_id: '123', item_name: 'Product', price: 99.99 });

// Add to cart
trackAddToCart({ item_id: '123', item_name: 'Product', price: 99.99 }, 99.99, 'USD');

// Purchase
trackPurchase('txn_123', 199.99, 'USD', [
  { item_id: '123', item_name: 'Product', price: 99.99, quantity: 1 },
]);
```

## Examples

See `app/modules/examples/analytics-example/index.tsx` for complete examples.

