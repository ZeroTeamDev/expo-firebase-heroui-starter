# Firebase Remote Config Setup Guide

Created by Kien AI (leejungkiin@gmail.com)

## Overview

This guide explains how to set up and use Firebase Remote Config in the Expo Mono-Starter project.

## Prerequisites

1. Firebase project created in [Firebase Console](https://console.firebase.google.com/)
2. Firebase config added to `.env` file
3. Firebase SDK installed (already done: `firebase@^12.3.0`)

## Firebase Console Setup

### Step 1: Enable Remote Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Remote Config** in the left sidebar
4. Click **"Get started"** if you haven't enabled Remote Config yet

### Step 2: Add Feature Flags

Add the following parameters in Firebase Remote Config Console:

#### Module Feature Flags

| Parameter Name | Default Value | Type |
|---------------|---------------|------|
| `module_weather_enabled` | `false` | Boolean |
| `module_entertainment_enabled` | `false` | Boolean |
| `module_management_enabled` | `false` | Boolean |
| `module_ai_tools_enabled` | `false` | Boolean |
| `module_saas_enabled` | `false` | Boolean |

#### AI Feature Flags

| Parameter Name | Default Value | Type |
|---------------|---------------|------|
| `ai_chat_enabled` | `false` | Boolean |
| `ai_vision_enabled` | `false` | Boolean |
| `ai_speech_enabled` | `false` | Boolean |

#### Theme Feature Flags

| Parameter Name | Default Value | Type |
|---------------|---------------|------|
| `theme_glass_effects_enabled` | `false` | Boolean |
| `theme_liquid_animations_enabled` | `false` | Boolean |

### Step 3: Add Parameters

1. Click **"Add parameter"** button
2. Enter parameter name (e.g., `module_weather_enabled`)
3. Set default value (e.g., `false`)
4. Set data type to **Boolean** (or String if using "true"/"false")
5. Click **"Save"**
6. Repeat for all parameters above

### Step 4: Publish Changes

1. After adding all parameters, click **"Publish changes"**
2. Your changes will be live immediately

## How It Works

### Initialization Flow

```
App Startup
  ↓
Check Remote Config Support
  ↓
Initialize Remote Config Instance
  ↓
Set Default Values (from firebase.client.ts)
  ↓
Fetch Remote Config from Firebase
  ↓
Activate New Values
  ↓
Sync Modules with Feature Flags
```

### Default Values

Default values are set in `integrations/firebase.client.ts`:

```typescript
setDefaults(remoteConfig, {
  module_weather_enabled: false,
  // ... other defaults
});
```

These defaults are used:
- Before first fetch completes
- If fetch fails
- As fallback values

### Fetch Behavior

- **Minimum Fetch Interval**: 1 hour (3600000ms)
- **Fetch Timeout**: 60 seconds (60000ms)
- **Auto-activate**: New values are activated automatically after fetch

## Usage in Code

### Using Hooks

```typescript
import { useIsFeatureEnabled } from '@/hooks/use-remote-config';

function MyComponent() {
  const isWeatherEnabled = useIsFeatureEnabled('module_weather_enabled');
  
  if (isWeatherEnabled) {
    return <WeatherModule />;
  }
  
  return null;
}
```

### Using Service Directly

```typescript
import { getFeatureFlag } from '@/services/remote-config';

const isEnabled = await getFeatureFlag('module_weather_enabled', false);
```

### Manual Fetch

```typescript
import { fetchRemoteConfig } from '@/services/remote-config';

// Fetch latest values from Firebase
const flags = await fetchRemoteConfig();
```

## Testing

### Enable a Module in Firebase Console

1. Go to Firebase Console > Remote Config
2. Find parameter `module_weather_enabled`
3. Click **"Edit"**
4. Change value to `true`
5. Click **"Publish changes"**
6. Restart app or call `fetchRemoteConfig()` to get new values

### Test in Development

You can also test with mock mode by checking logs:

```typescript
// Check if using Firebase or mock mode
console.log('[RemoteConfig] Using Firebase:', useFirebase);
```

## Troubleshooting

### Remote Config Not Loading

1. **Check Firebase Connection**: Ensure Firebase config is correct in `.env`
2. **Check Network**: Ensure device has internet connection
3. **Check Console**: Look for errors in console logs
4. **Fallback**: System automatically falls back to mock mode if Firebase fails

### Values Not Updating

1. **Publish Changes**: Make sure you clicked "Publish changes" in Firebase Console
2. **Fetch Interval**: Wait for minimum fetch interval (1 hour) or manually fetch
3. **Cache**: App uses cached values if fetch fails - check network connection

### Boolean Values

Firebase Remote Config stores values as strings. The service automatically converts:
- `"true"` → `true` (boolean)
- `"false"` → `false` (boolean)
- Numbers → Number type
- Other strings → String type

## Best Practices

1. **Always Set Defaults**: Set default values in `firebase.client.ts` for offline support
2. **Use Feature Flags**: Control feature rollouts via Firebase Console
3. **Monitor Changes**: Check logs to see when new values are fetched
4. **Test Before Publish**: Test changes in Firebase Console before publishing
5. **Gradual Rollout**: Use Firebase Remote Config conditions for A/B testing

## Advanced: Conditions & A/B Testing

Firebase Remote Config supports conditions for targeting:

1. **User Segments**: Target specific user groups
2. **App Versions**: Target specific app versions
3. **Platform**: Target iOS/Android/Web
4. **Random Percent**: Gradual rollout (e.g., 10% of users)

To set up conditions:
1. Go to Firebase Console > Remote Config
2. Click on a parameter
3. Click **"Add value for condition"**
4. Set condition and value
5. Publish changes

## References

- [Firebase Remote Config Documentation](https://firebase.google.com/docs/remote-config)
- [Firebase Remote Config REST API](https://firebase.google.com/docs/reference/remote-config/rest)
- [Remote Config Best Practices](https://firebase.google.com/docs/remote-config/best-practices)

---

**Status**: ✅ Firebase Remote Config Integration Complete
**Last Updated**: 2024-01-XX

