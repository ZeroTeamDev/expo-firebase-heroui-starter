# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo-based React Native starter project with Firebase integration, featuring:
- Cross-platform mobile app (iOS, Android, Web)
- Firebase Authentication with protected routes
- Dynamic module system with feature flags
- Firebase Remote Config integration
- Modern UI with HeroUI Native and NativeWind (Tailwind CSS)
- State management with Zustand

**App Name**: rockoai
**Project Type**: Expo Router v6 with file-based routing
**New Architecture**: Enabled (`newArchEnabled: true`)

## Development Commands

### Essential Commands
```bash
npm run dev          # Start Expo dev server (with tree shaking disabled)
npm run ios          # Run on iOS simulator/device
npm run android      # Run on Android emulator/device
npm run web          # Run in web browser
npm run lint         # Run ESLint
```

### iOS Development
```bash
cd ios && pod install           # Install iOS dependencies
npx expo run:ios                # Build and run on iOS
```

### Android Development
```bash
npx expo run:android            # Build and run on Android
```

## Architecture

### Core Systems

**1. Module System** ([modules/](modules/))
- Dynamic module registry with feature flag support
- Modules are registered in [modules/index.ts](modules/index.ts) with config:
  - `id`, `name`, `description`, `route`, `icon`, `permissions`
  - `enabledByDefault` and optional `featureFlag` key
- Module state managed via [stores/moduleStore.ts](stores/moduleStore.ts)
- Access modules via hooks: `useModules()`, `useModuleStore()`

**2. Firebase Remote Config** ([services/remote-config/](services/remote-config/))
- Controls feature flags for modules and features
- Dual implementation:
  - Native (iOS/Android): Uses `@react-native-firebase/remote-config`
  - Web: Falls back to Firebase JS SDK
- Service automatically falls back to mock mode if Firebase unavailable
- Config initialized in [app/_layout.tsx](app/_layout.tsx) on app startup
- Feature flags sync with module system via `syncModulesWithRemoteConfig()`

**3. Authentication Flow**
- Firebase Auth with AsyncStorage persistence ([integrations/firebase.client.ts](integrations/firebase.client.ts))
- Auth state in [stores/authStore.ts](stores/authStore.ts)
- Protected routes handled via Expo Router
- Auth screens: [app/auth/](app/auth/) (login, sign-up, forgot-password)
- Main app: [app/(tabs)/](app/(tabs)/) (requires authentication)

**4. Navigation Structure**
```
app/
├── _layout.tsx           # Root layout with providers & initialization
├── (tabs)/               # Bottom tab navigation (protected)
│   ├── _layout.tsx       # Dynamic tabs from module system
│   ├── index.tsx         # Home screen
│   └── explore.tsx       # Explore screen
└── auth/                 # Authentication screens (public)
    ├── index.tsx         # Auth entry
    ├── login.tsx
    ├── sign-up.tsx
    └── forgot-password.tsx
```

### State Management (Zustand)

**Stores** ([stores/](stores/)):
- `authStore.ts` - User authentication state
- `moduleStore.ts` - Module registry and enabled modules
- `remoteConfigStore.ts` - Feature flags from Firebase

Access pattern:
```typescript
const enabledModules = useModuleStore(state => state.enabledModuleIds);
const isWeatherEnabled = useIsFeatureEnabled('module_weather_enabled');
```

### UI Components

**Component Categories** ([components/](components/)):
- `glass/` - Glassmorphism effects (GlassPanel, GlassCard, GlassModal)
- `liquid/` - Liquid animations (LiquidBlob, LiquidBackground)
- `ai/` - AI interaction components (AIChip, AIPrompt, AIStreaming)
- `layout/` - Layout components (AppHeader, AppDrawer, LiquidTabBar)
- `common/` - Shared components
- `ui/` - Base UI components (icon-symbol with iOS SF Symbols support)

**Theme System**:
- Configured in [app/_layout.tsx](app/_layout.tsx) via HeroUINativeProvider
- Supports light/dark modes with system preference detection
- Colors defined separately for light and dark themes
- Access theme colors via HeroUI Native theme tokens

### Firebase Configuration

**Setup** ([integrations/firebase.client.ts](integrations/firebase.client.ts)):
- Environment variables required in `.env`:
  ```
  EXPO_PUBLIC_FIREBASE_API_KEY
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
  EXPO_PUBLIC_FIREBASE_PROJECT_ID
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  EXPO_PUBLIC_FIREBASE_APP_ID
  EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
  ```

**Remote Config Feature Flags**:
```typescript
// Module flags
module_weather_enabled: boolean
module_entertainment_enabled: boolean
module_management_enabled: boolean
module_ai_tools_enabled: boolean
module_saas_enabled: boolean

// AI feature flags
ai_chat_enabled: boolean
ai_vision_enabled: boolean
ai_speech_enabled: boolean

// Theme flags
theme_glass_effects_enabled: boolean
theme_liquid_animations_enabled: boolean
```

## Key Technical Details

### Expo Configuration
- SDK 54 with Expo Router 6
- React Native New Architecture enabled
- Plugins: expo-router, expo-splash-screen, expo-font, @react-native-firebase/app
- Typed routes enabled via `experiments.typedRoutes`

### TypeScript Setup
- Strict mode enabled
- Path alias `@/*` maps to project root
- Firebase Auth types patched for React Native: `@firebase/auth` → `node_modules/@firebase/auth/dist/index.rn.d.ts`

### Styling
- NativeWind 4.2 for Tailwind CSS in React Native
- HeroUI Native components for consistent UI
- Global styles in [app/globals.css](app/globals.css)
- Use `className` prop for Tailwind utilities

### Platform-Specific Code
- iOS-specific files: `*.ios.tsx` (e.g., [components/ui/icon-symbol.ios.tsx](components/ui/icon-symbol.ios.tsx))
- Android-specific files: `*.android.tsx`
- Web-specific files: `*.web.ts` (e.g., [hooks/use-color-scheme.web.ts](hooks/use-color-scheme.web.ts))

## Adding New Modules

1. Create module directory in [modules/](modules/) (e.g., `modules/weather/`)
2. Register module in [modules/index.ts](modules/index.ts):
   ```typescript
   registerModule({
     id: "weather",
     name: "Weather",
     route: "weather",
     icon: { ios: "cloud.sun.fill", name: "cloud" },
     enabled: false,
     enabledByDefault: false,
     featureFlag: "module_weather_enabled",
     permissions: { requiresAuth: false }
   });
   ```
3. Add feature flag to Firebase Console
4. Create route file in [app/(tabs)/](app/(tabs)/) matching the route name
5. Module will automatically appear in tabs when enabled via Remote Config

## Common Patterns

### Form Validation
- React Hook Form + Zod for schema validation
- Use `@hookform/resolvers/zod` for integration

### Haptic Feedback
- `expo-haptics` for touch feedback
- Use in interactive components (buttons, tabs)

### Protected Routes
- Check authentication state via `useAuthStore()` or `useIsAuthenticated()`
- Expo Router handles redirects based on auth state

### Notifications
- `react-native-notifier` for in-app notifications
- NotifierWrapper in root layout provides context

## Important Notes

- **Tree Shaking**: Disabled in dev mode (`EXPO_UNSTABLE_TREE_SHAKING=false`) for faster builds
- **Firebase Initialization**: Single app instance with proper AsyncStorage persistence for auth
- **Module Sync**: Happens automatically on app startup; manual sync via `syncModulesWithRemoteConfig(featureFlags)`
- **Remote Config Fetch**: 1-hour cache interval in production, no cache in dev mode
- **SF Symbols**: Use iOS SF Symbol names for icons; component handles cross-platform fallbacks

## Development Workflow

1. **Setup**: Install dependencies → Configure `.env` → Enable Firebase services
2. **Development**: Use `npm run dev` → Test on simulator/device
3. **Adding Features**: Create components → Update stores → Add routes → Test with feature flags
4. **Deployment**: Build iOS/Android apps via EAS or local builds

## Documentation

Additional docs in [docs/](docs/):
- [FIREBASE_REMOTE_CONFIG_SETUP.md](docs/FIREBASE_REMOTE_CONFIG_SETUP.md) - Remote Config setup guide
- [FIREBASE_REMOTE_CONFIG_REACT_NATIVE.md](docs/FIREBASE_REMOTE_CONFIG_REACT_NATIVE.md) - React Native Firebase details
- [SCAFFOLDING_SUMMARY.md](docs/SCAFFOLDING_SUMMARY.md) - Architecture overview

Phase-based documentation in [docs/ai/](docs/ai/) for requirements, design, planning, implementation, testing, deployment, and monitoring.

## Dependencies to Note

- `expo` ~54.0 - Core platform
- `react` 19.1.0 / `react-native` 0.81.4
- `firebase` ^12.3.0 - Web SDK
- `@react-native-firebase/app` ^23.5.0 - Native SDK
- `@react-native-firebase/remote-config` ^23.5.0 - Remote Config
- `heroui-native` ^1.0.0-alpha.13 - UI components
- `nativewind` ^4.2.1 - Tailwind for RN
- `zustand` ^5.0.8 - State management
- `react-hook-form` ^7.63.0 + `zod` ^4.1.11 - Forms
- `expo-router` ~6.0.8 - File-based routing
