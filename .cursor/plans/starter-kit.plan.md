# Expo AI Starter Kit - Kiến Trúc Mono-Starter

## Mục tiêu

Xây dựng khung cấu trúc tái sử dụng cho mono-starter với module system, Firebase Functions chuẩn, UI components library, và AI layer architecture - không implement chi tiết module mà chỉ thiết kế scaffolding.

## Kiến trúc tổng quan

### 1. Project Structure (Mono-Starter)

```
expo-firebase-heroui-starter/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Dynamic tabs based on modules
│   │   ├── _layout.tsx           # Tab navigation với module filtering
│   │   └── index.tsx             # Home dashboard
│   ├── modules/                  # Module routes (dynamic)
│   │   ├── weather/              # Weather module (nếu enabled)
│   │   ├── entertainment/        # Entertainment module
│   │   ├── management/           # Task/Management module
│   │   ├── ai-tools/             # AI Tools module
│   │   └── saas/                 # SaaS utilities module
│   ├── auth/                     # Existing auth flow
│   └── _layout.tsx               # Root layout với Remote Config
├── modules/                      # Module definitions & exports
│   ├── index.ts                  # Module registry & feature flags
│   ├── types.ts                  # Module interface definitions
│   ├── weather/                  # Weather module package
│   │   ├── index.ts              # Module export
│   │   ├── components/           # Module-specific components
│   │   ├── screens/              # Module screens
│   │   ├── hooks/                # Module hooks
│   │   └── services/             # Module services
│   ├── entertainment/
│   ├── management/
│   ├── ai-tools/
│   └── saas/
├── components/                   # Shared UI components
│   ├── layout/
│   │   ├── AppHeader.tsx         # Standard header component
│   │   ├── AppDrawer.tsx         # Side drawer navigation
│   │   └── LiquidTabBar.tsx      # Custom tab bar với liquid blob
│   ├── glass/
│   │   ├── GlassPanel.tsx        # Reusable glass panel wrapper
│   │   ├── GlassCard.tsx         # Glass card component
│   │   └── GlassModal.tsx        # Glass modal overlay
│   ├── liquid/
│   │   ├── LiquidBlob.tsx        # Skia liquid blob animation
│   │   └── LiquidBackground.tsx  # Background liquid effect
│   ├── ai/
│   │   ├── AIChip.tsx            # Voice input chip với waveform
│   │   ├── AIPrompt.tsx          # AI prompt input component
│   │   └── AIStreaming.tsx       # Streaming response display
│   └── common/                    # Common reusable components
├── services/                     # Core services
│   ├── remote-config/            # Remote Config service
│   │   ├── index.ts              # Remote Config client
│   │   └── types.ts               # Feature flags types
│   ├── firebase/
│   │   ├── functions.ts          # Firebase Functions client
│   │   ├── app-check.ts          # App Check setup
│   │   └── analytics.ts          # Analytics wrapper
│   └── ai/                       # AI service layer
│       ├── client.ts             # AI Functions client
│       └── types.ts              # AI request/response types
├── hooks/                        # Shared hooks
│   ├── use-remote-config.ts      # Remote Config hook
│   ├── use-modules.ts            # Module registry hook
│   └── use-ai.ts                 # AI service hook
├── stores/                       # Zustand stores
│   ├── moduleStore.ts            # Active modules state
│   ├── remoteConfigStore.ts      # Remote Config cache
│   └── aiStore.ts                # AI conversation state
├── functions/                    # Firebase Functions (separate repo/path)
│   ├── src/
│   │   ├── index.ts              # Functions entry point
│   │   ├── core/                 # Core reusable functions
│   │   │   ├── middleware.ts     # Common middleware (auth, rate-limit, etc.)
│   │   │   ├── errors.ts         # Error handling utilities
│   │   │   └── validation.ts     # Request validation helpers
│   │   ├── ai/                   # AI Functions
│   │   │   ├── chat.ts           # Text chat endpoint
│   │   │   ├── vision.ts         # Vision/image analysis
│   │   │   └── speech.ts         # Speech-to-text (Whisper)
│   │   ├── modules/              # Module-specific functions
│   │   │   ├── weather.ts        # Weather data aggregation
│   │   │   └── [module-name].ts  # Other modules
│   │   └── config/               # Configuration
│   │       ├── secrets.ts        # Environment secrets
│   │       └── rate-limit.ts     # Rate limiting config
│   ├── package.json
│   └── .env.example
└── integrations/                # External integrations
    └── firebase.client.ts        # Existing Firebase client
```

## Implementation Plan

### Phase 1: Core Infrastructure & Module System

#### 1.1 Module Registry System

- **File**: `modules/index.ts`, `modules/types.ts`
- **Purpose**: Central registry cho tất cả modules với metadata
- **Features**:
  - Module interface definition (route, icon, title, permissions)
  - Feature flag checking via Remote Config
  - Dynamic module loading
  - Module dependency management

#### 1.2 Remote Config Integration

- **Files**: `services/remote-config/`, `hooks/use-remote-config.ts`, `stores/remoteConfigStore.ts`
- **Purpose**: Feature flags và dynamic configuration
- **Features**:
  - Fetch và cache Remote Config values
  - Feature flags cho modules (e.g., `module_weather_enabled`)
  - Theme tokens override
  - AI rate limits configuration
  - A/B testing flags

#### 1.3 Module Store & State Management

- **File**: `stores/moduleStore.ts`
- **Purpose**: Quản lý active modules và navigation state
- **Features**:
  - Track enabled modules
  - Module navigation state
  - Module-specific settings

### Phase 2: UI Component Library

#### 2.1 Glass Components (`components/glass/`)

- **GlassPanel.tsx**: Base glass wrapper với blur + gradient + border
  - Props: blur intensity, opacity, border radius, gradient colors
  - Support dark/light theme
  - Reanimated for smooth transitions
- **GlassCard.tsx**: Card component với glass effect
- **GlassModal.tsx**: Modal overlay với glass backdrop

#### 2.2 Liquid Effects (`components/liquid/`)

- **LiquidBlob.tsx**: Skia metaballs/blob animation
  - Configurable blob count, colors, animation speed
  - Performance optimized với Skia
- **LiquidBackground.tsx**: Background liquid effect cho screens
- **LiquidTabBar.tsx**: Custom tab bar với animated blob under active tab

#### 2.3 Standard Header (`components/layout/AppHeader.tsx`)

- **Features**:
  - Screen title (dynamic)
  - Search bar (command bar style)
  - Profile avatar với dropdown
  - Theme toggle button
  - Glass effect styling
  - Responsive layout

#### 2.4 Drawer Navigation (`components/layout/AppDrawer.tsx`)

- **Features**:
  - Settings navigation
  - Labs/Experiments section
  - About/Help
  - Module shortcuts
  - Glass panel styling

### Phase 3: Firebase Functions Architecture

#### 3.1 Functions Core Structure

- **Location**: `functions/src/` (separate directory hoặc monorepo)
- **Purpose**: Reusable Functions architecture cho các dự án mới
- **Core Files**:
  - `core/middleware.ts`: Auth check, rate limiting, error handling
  - `core/errors.ts`: Standardized error responses
  - `core/validation.ts`: Request validation helpers
  - `config/secrets.ts`: Environment secrets management

#### 3.2 AI Functions Endpoints

- **`ai/chat.ts`**: Text chat với streaming support
  - Input: message, conversation_id, model preference
  - Output: Streaming SSE response
  - Rate limiting per user
- **`ai/vision.ts`**: Image analysis
  - Input: image_url hoặc base64, prompt
  - Output: Caption/OCR/analysis
- **`ai/speech.ts`**: Speech-to-text
  - Input: audio_url hoặc base64
  - Output: Transcript

#### 3.3 Functions Configuration

- **App Check**: Verify requests từ legitimate app
- **Rate Limiting**: Per-user và per-IP limits
- **Secrets Management**: API keys trong Functions environment
- **CORS**: Configure cho web support

### Phase 4: AI Layer Integration

#### 4.1 AI Service Client (`services/ai/client.ts`)

- **Purpose**: Client-side wrapper cho AI Functions
- **Features**:
  - Type-safe API calls
  - Streaming response handling
  - Error handling và retries
  - Request queuing

#### 4.2 AI Components (`components/ai/`)

- **AIChip.tsx**: Voice input button với waveform animation
- **AIPrompt.tsx**: Text input với AI suggestions
- **AIStreaming.tsx**: Display streaming responses với typing animation

#### 4.3 AI Store (`stores/aiStore.ts`)

- Conversation history
- Streaming state
- Error handling

### Phase 5: Navigation & Routing

#### 5.1 Dynamic Tab Navigation

- **File**: `app/(tabs)/_layout.tsx`
- **Purpose**: Dynamic tabs dựa trên enabled modules
- **Implementation**:
  - Read enabled modules từ moduleStore
  - Generate tabs dynamically
  - Support custom tab icons và labels

#### 5.2 Module Routing

- **File**: `app/modules/[module-name]/`
- **Purpose**: Module-specific routes
- **Features**:
  - Lazy loading modules
  - Protected routes per module
  - Module-specific layouts

### Phase 6: Module Scaffolding

#### 6.1 Module Template Structure

Mỗi module trong `modules/[name]/` có:

- `index.ts`: Module definition export
- `components/`: Module-specific components
- `screens/`: Module screens
- `hooks/`: Module hooks
- `services/`: Module services
- `types.ts`: Module types

#### 6.2 Example Module Placeholders

- **Weather**: Placeholder với structure
- **Entertainment**: Placeholder với structure
- **Management**: Placeholder với structure
- **AI Tools**: Placeholder với structure
- **SaaS**: Placeholder với structure

### Phase 8: Additional Dependencies & Setup

#### 7.1 Required Packages

```json
{
  "expo-blur": "~14.0.0",
  "@shopify/react-native-skia": "~1.0.0",
  "moti": "^0.28.0",
  "@tanstack/react-query": "^5.0.0",
  "firebase": "^12.3.0", // Already installed
  "expo-av": "~15.0.0",
  "expo-camera": "~17.0.0",
  "expo-image-picker": "~16.0.0",
  "expo-image-manipulator": "~13.0.0",
  "expo-speech": "~13.0.0",
  "lucide-react-native": "^0.400.0"
}
```

#### 7.2 Firebase Functions Setup

- Initialize Functions project
- Setup TypeScript config
- Configure deployment scripts
- Environment variables setup
- App Check integration

#### 7.3 Development Tools

- ESLint configuration updates
- Prettier config
- Husky + lint-staged setup
- Expo Updates configuration
- Sentry integration (optional)

## Files to Create/Modify

### New Files (Core Infrastructure)

- `modules/index.ts` - Module registry
- `modules/types.ts` - Module interfaces
- `services/remote-config/index.ts` - Remote Config client
- `services/remote-config/types.ts` - Feature flags types
- `services/firebase/functions.ts` - Functions client
- `services/firebase/app-check.ts` - App Check setup
- `services/ai/client.ts` - AI service client
- `services/ai/types.ts` - AI types
- `hooks/use-remote-config.ts` - Remote Config hook
- `hooks/use-modules.ts` - Module registry hook
- `hooks/use-ai.ts` - AI service hook
- `stores/moduleStore.ts` - Module state
- `stores/remoteConfigStore.ts` - Remote Config cache
- `stores/aiStore.ts` - AI conversation state

### New Files (UI Components)

- `components/layout/AppHeader.tsx` - Standard header
- `components/layout/AppDrawer.tsx` - Drawer navigation
- `components/layout/LiquidTabBar.tsx` - Custom tab bar
- `components/glass/GlassPanel.tsx` - Glass wrapper
- `components/glass/GlassCard.tsx` - Glass card
- `components/glass/GlassModal.tsx` - Glass modal
- `components/liquid/LiquidBlob.tsx` - Skia blob
- `components/liquid/LiquidBackground.tsx` - Background effect
- `components/ai/AIChip.tsx` - Voice input chip
- `components/ai/AIPrompt.tsx` - AI prompt input
- `components/ai/AIStreaming.tsx` - Streaming display

### New Files (Module Scaffolds)

- `modules/weather/index.ts` - Weather module definition
- `modules/entertainment/index.ts` - Entertainment module
- `modules/management/index.ts` - Management module
- `modules/ai-tools/index.ts` - AI Tools module
- `modules/saas/index.ts` - SaaS module

### New Files (Firebase Functions)

- `functions/src/index.ts` - Functions entry
- `functions/src/core/middleware.ts` - Common middleware
- `functions/src/core/errors.ts` - Error handling
- `functions/src/core/validation.ts` - Validation
- `functions/src/ai/chat.ts` - Chat endpoint
- `functions/src/ai/vision.ts` - Vision endpoint
- `functions/src/ai/speech.ts` - Speech endpoint
- `functions/src/config/secrets.ts` - Secrets config
- `functions/src/config/rate-limit.ts` - Rate limit config
- `functions/package.json` - Functions dependencies
- `functions/tsconfig.json` - Functions TypeScript config
- `functions/.env.example` - Environment template

### Modified Files

- `app/_layout.tsx` - Add Remote Config initialization
- `app/(tabs)/_layout.tsx` - Dynamic tabs từ module registry
- `tailwind.config.js` - Add glass/liquid utilities
- `package.json` - Add new dependencies
- `integrations/firebase.client.ts` - Add Remote Config, App Check
- `app.json` - Update plugins nếu cần

## Security & Performance

### Security

- App Check integration
- Rate limiting trong Functions
- API keys trong Functions environment only
- User authentication required cho AI endpoints
- Firestore security rules cho module data

### Performance

- React Query cache cho Remote Config
- Lazy loading modules
- Skia animations optimized
- Image optimization với expo-image
- Code splitting per module

## Documentation

### Files to Create

- `docs/architecture.md` - Kiến trúc tổng quan
- `docs/modules.md` - Module development guide
- `docs/functions.md` - Functions development guide
- `docs/ui-components.md` - UI components documentation
- `docs/remote-config.md` - Remote Config setup guide
- `docs/ai-integration.md` - AI layer documentation

## Testing Strategy

- Unit tests cho module registry
- Integration tests cho Remote Config
- Component tests cho UI components
- Functions tests với emulator
- E2E tests cho critical flows

## Deployment

### Functions Deployment

- Separate deployment scripts
- Environment management
- Version tagging
- Rollback procedures

### App Deployment

- Expo Updates configuration
- Feature flag rollout strategy
- A/B testing setup