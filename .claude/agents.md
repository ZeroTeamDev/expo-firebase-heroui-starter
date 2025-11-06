# Project Agents - Rockoai Development Team

This file defines specialized agents for working on the Rockoai project. Each agent has specific expertise and responsibilities.

---

## 1. Architecture Agent (The Architect)

**Role**: System Design & Architecture Specialist

**Expertise**:
- Module system design and scalability
- State management architecture (Zustand stores)
- Firebase integration patterns
- Cross-platform architecture (iOS/Android/Web)
- Performance optimization strategies

**Responsibilities**:
- Design new module structures
- Review and optimize state management
- Plan Firebase Remote Config feature flags
- Ensure architectural consistency
- Design scalable component hierarchies
- Plan integration between systems (Auth, Modules, Remote Config)

**When to Use**:
- Adding new major features or modules
- Refactoring existing architecture
- Performance optimization planning
- Designing complex component interactions
- Planning feature flag strategies

**Key Commands**:
```bash
# Review architecture patterns
npx expo start --clear  # Fresh start to test architecture changes
```

**Focus Areas**:
- [modules/](modules/) - Module system architecture
- [stores/](stores/) - State management patterns
- [services/](services/) - Service layer design
- [app/_layout.tsx](app/_layout.tsx) - App initialization flow

---

## 2. Firebase Agent (The Backend Specialist)

**Role**: Firebase & Backend Integration Expert

**Expertise**:
- Firebase Authentication (Web & React Native SDKs)
- Firebase Remote Config (dual implementation)
- Firestore database operations
- Firebase Storage integration
- Environment configuration and security

**Responsibilities**:
- Manage Firebase client configuration
- Implement Remote Config feature flags
- Handle authentication flows
- Optimize Firebase queries and caching
- Troubleshoot Firebase integration issues
- Manage environment variables and security

**When to Use**:
- Firebase configuration issues
- Authentication flow problems
- Remote Config setup or troubleshooting
- Adding new Firebase services
- Database schema design
- Security rules configuration

**Key Files**:
- [integrations/firebase.client.ts](integrations/firebase.client.ts)
- [integrations/firebase-remote-config.client.ts](integrations/firebase-remote-config.client.ts)
- [services/remote-config/](services/remote-config/)
- [stores/authStore.ts](stores/authStore.ts)
- [stores/remoteConfigStore.ts](stores/remoteConfigStore.ts)

**Key Commands**:
```bash
# Test Firebase connection
npx expo start --dev-client

# iOS with Firebase native modules
npx expo run:ios

# Android with Firebase native modules
npx expo run:android
```

**Important Notes**:
- Native Firebase modules require rebuild: `npx expo run:ios` or `npx expo run:android`
- Web uses Firebase JS SDK, native uses React Native Firebase
- Remote Config has auto-fallback to mock mode if Firebase unavailable

---

## 3. UI/UX Agent (The Designer)

**Role**: UI Components & User Experience Specialist

**Expertise**:
- HeroUI Native component system
- NativeWind/Tailwind CSS styling
- Glassmorphism effects
- Liquid animations with Skia
- Cross-platform UI consistency
- Accessibility and haptic feedback

**Responsibilities**:
- Design and implement UI components
- Ensure cross-platform visual consistency
- Implement animations and transitions
- Manage theme system (light/dark modes)
- Create reusable component patterns
- Optimize UI performance

**When to Use**:
- Creating new UI components
- Styling screens and layouts
- Implementing animations
- Theme customization
- Accessibility improvements
- Visual bug fixes

**Key Directories**:
- [components/glass/](components/glass/) - Glassmorphism components
- [components/liquid/](components/liquid/) - Liquid animations
- [components/ai/](components/ai/) - AI interaction UI
- [components/layout/](components/layout/) - Layout components
- [app/(tabs)/](app/(tabs)/) - Screen implementations

**Key Commands**:
```bash
# Run with inspector for UI debugging
npx expo start --dev-client

# iOS for SF Symbols testing
npx expo run:ios

# Web for rapid UI iteration
npm run web
```

**Styling Guidelines**:
- Use NativeWind `className` prop for Tailwind utilities
- HeroUI Native theme tokens for colors
- Platform-specific components: `*.ios.tsx`, `*.android.tsx`, `*.web.tsx`
- Theme config in [app/_layout.tsx](app/_layout.tsx)

---

## 4. Module Agent (The Feature Builder)

**Role**: Module System & Feature Implementation Expert

**Expertise**:
- Dynamic module system architecture
- Feature flag integration
- Module registration and lifecycle
- Route-based navigation
- Module permissions and dependencies
- Component composition within modules

**Responsibilities**:
- Create new modules (Weather, Entertainment, AI Tools, etc.)
- Integrate modules with feature flags
- Implement module-specific features
- Handle module permissions and auth
- Test module enable/disable flows
- Document module APIs

**When to Use**:
- Adding new modules to the app
- Implementing module-specific features
- Debugging module registration issues
- Setting up feature flag controls
- Testing dynamic tab navigation
- Managing module dependencies

**Key Files**:
- [modules/index.ts](modules/index.ts) - Module registry
- [modules/types.ts](modules/types.ts) - Type definitions
- [stores/moduleStore.ts](stores/moduleStore.ts) - Module state
- [hooks/use-modules.ts](hooks/use-modules.ts) - Module hooks
- [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx) - Dynamic tabs

**Module Creation Workflow**:
1. Create module directory in `modules/[module-name]/`
2. Register in `modules/index.ts`:
   ```typescript
   registerModule({
     id: "my-module",
     name: "My Module",
     description: "Module description",
     route: "my-module",
     icon: { ios: "star.fill", name: "star" },
     enabled: false,
     enabledByDefault: false,
     featureFlag: "module_my_module_enabled",
     permissions: { requiresAuth: false }
   });
   ```
3. Create route in `app/(tabs)/my-module.tsx`
4. Add feature flag to Firebase Console
5. Test enable/disable via Remote Config

**Testing Commands**:
```typescript
// Enable module for testing
import { setDefaultFeatureFlags } from '@/services/remote-config';
setDefaultFeatureFlags({ module_my_module_enabled: true });

// Check enabled modules
import { useModules } from '@/hooks/use-modules';
const modules = useModules();
console.log(modules);
```

---

## 5. DevOps Agent (The Platform Specialist)

**Role**: Build, Deployment & Cross-Platform Expert

**Expertise**:
- Expo configuration and builds
- iOS/Android native configuration
- Build optimization and troubleshooting
- Platform-specific issues
- Environment setup
- CI/CD pipelines
- App distribution

**Responsibilities**:
- Manage Expo configuration
- Handle iOS/Android native builds
- Configure native modules and dependencies
- Troubleshoot build issues
- Optimize bundle size
- Set up CI/CD workflows
- Manage app submissions

**When to Use**:
- Build errors or configuration issues
- Adding native modules
- iOS/Android specific problems
- Bundle size optimization
- Setting up deployment pipelines
- App store submission prep
- Environment configuration issues

**Key Files**:
- [app.json](app.json) - Expo configuration
- [package.json](package.json) - Dependencies
- [tsconfig.json](tsconfig.json) - TypeScript config
- `ios/Podfile` - iOS native dependencies
- `android/` - Android configuration

**Key Commands**:
```bash
# Development
npm run dev                    # Start dev server
npm run ios                    # Run iOS (development build)
npm run android                # Run Android (development build)
npm run web                    # Run web

# Native builds (required after adding native modules)
npx expo run:ios               # Build and run iOS
npx expo run:android           # Build and run Android

# Clean builds
cd ios && pod install          # Reinstall iOS pods
npx expo start --clear         # Clear Metro cache

# Production builds (EAS)
eas build --platform ios       # Build for iOS
eas build --platform android   # Build for Android
eas submit                     # Submit to stores

# Troubleshooting
npx expo-doctor                # Check for common issues
npx expo install --check       # Check dependency compatibility
```

**Common Issues & Solutions**:

1. **Native module not found** (e.g., Firebase Remote Config):
   ```bash
   # iOS
   cd ios && pod install && cd ..
   npx expo run:ios

   # Android
   npx expo run:android
   ```

2. **Metro cache issues**:
   ```bash
   npx expo start --clear
   rm -rf node_modules && npm install
   ```

3. **iOS build issues**:
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   npx expo run:ios
   ```

4. **Android build issues**:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx expo run:android
   ```

**Platform-Specific Notes**:
- **iOS**: Requires Xcode, supports SF Symbols
- **Android**: Requires Android Studio
- **Web**: Limited native module support, uses web fallbacks
- **New Architecture**: Enabled in this project (`newArchEnabled: true`)

---

## Agent Collaboration Patterns

### Pattern 1: New Feature Development
1. **Architecture Agent** - Design feature architecture
2. **Module Agent** - Implement module structure
3. **UI/UX Agent** - Create UI components
4. **Firebase Agent** - Add backend integration
5. **DevOps Agent** - Test across platforms

### Pattern 2: Bug Fixes
1. **Identify Area** - Determine which agent's domain
2. **Root Cause** - Agent analyzes the issue
3. **Fix & Test** - Agent implements solution
4. **DevOps Agent** - Verify across platforms

### Pattern 3: Performance Optimization
1. **Architecture Agent** - Identify bottlenecks
2. **Firebase Agent** - Optimize queries and caching
3. **UI/UX Agent** - Optimize renders and animations
4. **DevOps Agent** - Profile and measure improvements

### Pattern 4: New Module Addition
1. **Architecture Agent** - Design module interface
2. **Module Agent** - Register and scaffold module
3. **Firebase Agent** - Set up feature flags
4. **UI/UX Agent** - Create module UI
5. **DevOps Agent** - Test on all platforms

---

## Quick Agent Selection Guide

**Choose the agent based on the task:**

| Task Type | Agent | Example |
|-----------|-------|---------|
| System design changes | Architecture | Refactoring state management |
| Firebase issues | Firebase | Remote Config not working |
| Visual changes | UI/UX | Styling a new component |
| Adding features | Module | Creating Weather module |
| Build/platform issues | DevOps | iOS build failing |
| State management | Architecture | Adding new Zustand store |
| Authentication | Firebase | Login flow issues |
| Animations | UI/UX | Implementing liquid effects |
| Feature flags | Firebase + Module | Controlling module visibility |
| Cross-platform bugs | DevOps | Different behavior on iOS/Android |

---

## Tips for Working with Agents

1. **Be Specific**: Clearly state which agent should handle the task
2. **Context Matters**: Provide relevant files and error messages
3. **Sequential Tasks**: Complex work may need multiple agents in sequence
4. **Validate Assumptions**: Agents should verify their understanding before acting
5. **Documentation**: Agents should update relevant docs when making changes

---

**Last Updated**: 2025-01-06
**Project**: Rockoai (expo-firebase-heroui-starter2)
