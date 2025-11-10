<!-- d0fc4e77-aa10-433e-bdc9-f51dfa412081 a0e1f30f-684d-4a7c-a903-332a9de1d57c -->
# UI Design Plan - AppHeader Component

## Mục tiêu

Thiết kế và implement AppHeader component đầy đủ với glass morphism effect, search functionality, profile dropdown, theme toggle, và responsive layout theo kế hoạch trong starter-kit.plan.md.

## Phân tích yêu cầu

Theo kế hoạch, AppHeader cần có:

- Screen title (dynamic)
- Search bar (command bar style)
- Profile avatar với dropdown
- Theme toggle button
- Glass effect styling
- Responsive layout

## Thiết kế UI Components

### 1. AppHeader Component (`components/layout/AppHeader.tsx`)

**Layout Structure:**

```
┌─────────────────────────────────────────────────┐
│ [Back] [Title]        [Search] [Theme] [Avatar] │
└─────────────────────────────────────────────────┘
```

**Features:**

- Glass morphism background sử dụng GlassViewNative
- Dynamic title từ route/screen props
- Optional back button (khi có navigation)
- Search button mở search modal/command bar
- Theme toggle button (light/dark)
- Profile avatar với dropdown menu
- Safe area handling
- Smooth animations với Reanimated

**Props Interface:**

```typescript
interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showSearch?: boolean;
  onSearchPress?: () => void;
  showProfile?: boolean;
  showThemeToggle?: boolean;
  rightActions?: React.ReactNode;
}
```

### 2. Search Command Bar (`components/layout/SearchCommandBar.tsx`)

**Features:**

- Full-screen modal overlay với glass backdrop
- Search input với focus animation
- Recent searches (nếu có)
- Quick actions/suggestions
- Keyboard handling
- Smooth slide-in animation

### 3. Profile Dropdown (`components/layout/ProfileDropdown.tsx`)

**Features:**

- User avatar (từ auth store)
- User name/email display
- Menu items:
  - Profile Settings
  - Account Settings
  - Theme Settings
  - Help & Support
  - Logout
- Glass panel styling
- Smooth dropdown animation
- Click outside to close

### 4. Theme Toggle Button (`components/layout/ThemeToggle.tsx`)

**Features:**

- Icon toggle (sun/moon)
- Smooth rotation animation
- Haptic feedback
- Accessible labels

## Implementation Steps

### Step 1: Enhance Glass Components

**Files:**

- `components/glass/GlassPanel.tsx` - Improve với proper blur và gradient
- `components/glass/GlassCard.tsx` - Create reusable glass card
- `components/glass/GlassModal.tsx` - Create glass modal overlay

**Tasks:**

- Update GlassPanel với GlassViewNative integration
- Add proper blur intensity và opacity controls
- Support dark/light theme variants
- Add border và shadow effects

### Step 2: Create AppHeader Component

**File:** `components/layout/AppHeader.tsx`

**Implementation:**

- Use GlassViewNative cho background
- Layout với flexbox (left: back + title, right: actions)
- Integrate với useTheme từ heroui-native
- Add safe area insets
- Implement animations với Reanimated
- Support dynamic title từ route
- Optional back button với navigation integration

**Dependencies:**

- `@/components/glass/GlassViewNative`
- `@/components/ui/icon-symbol`
- `heroui-native` (useTheme)
- `react-native-reanimated`
- `react-native-safe-area-context`

### Step 3: Create Search Command Bar

**File:** `components/layout/SearchCommandBar.tsx`

**Implementation:**

- Modal overlay với glass backdrop
- Search input component
- Recent searches list
- Quick actions grid
- Keyboard handling với react-native-keyboard-controller
- Slide-in animation từ top
- Close on outside press

**State Management:**

- Search query state
- Recent searches (local storage hoặc store)
- Modal visibility state

### Step 4: Create Profile Dropdown

**File:** `components/layout/ProfileDropdown.tsx`

**Implementation:**

- User avatar component (từ auth store)
- Dropdown menu với glass panel
- Menu items với icons
- Click outside to close
- Smooth dropdown animation
- Navigation integration cho menu items

**Menu Items:**

- Profile (navigate to profile screen)
- Settings (navigate to settings)
- Theme (toggle theme)
- Help (navigate to help)
- Logout (call logout function)

### Step 5: Create Theme Toggle Component

**File:** `components/layout/ThemeToggle.tsx`

**Implementation:**

- Icon button với sun/moon icons
- Rotation animation khi toggle
- Haptic feedback
- Accessible labels
- Integrate với useTheme toggleTheme

### Step 6: Integrate AppHeader vào Navigation

**Files:**

- `app/(tabs)/_layout.tsx` - Add AppHeader to tab screens
- `app/_layout.tsx` - Consider global header option

**Implementation:**

- Replace default header với custom AppHeader
- Pass route information cho dynamic title
- Handle navigation events
- Support different header configs per screen

### Step 7: Add Icon Mappings

**File:** `components/ui/icon-symbol.tsx`

**New Icons Needed:**

- `magnifyingglass` - Search
- `sun.max.fill` - Light theme
- `moon.fill` - Dark theme
- `person.circle.fill` - Profile
- `chevron.left` - Back
- `gear` - Settings
- `questionmark.circle` - Help
- `arrow.right.square` - Logout

## Design Specifications

### Glass Effect

- Blur intensity: 20-30
- Opacity: 0.7-0.9 (light), 0.6-0.8 (dark)
- Border radius: 16-20px
- Border: 1px với rgba(255,255,255,0.2)
- Shadow: subtle elevation

### Spacing

- Header height: 56-64px (including safe area)
- Horizontal padding: 16px
- Icon size: 24px
- Avatar size: 32-40px
- Button touch target: 44x44px minimum

### Typography

- Title: 18-20px, semibold
- Search placeholder: 16px, regular
- Menu items: 16px, regular

### Colors

- Use theme colors từ heroui-native
- Foreground: colors.foreground
- Muted: colors.mutedForeground
- Background: glass effect với colors.surface1
- Accent: colors.accent

### Animations

- Header slide-in: 200ms ease-out
- Dropdown: 150ms spring
- Theme toggle: 300ms rotation
- Search modal: 250ms slide from top
- Button press: scale 0.95

## Files to Create/Modify

### New Files

- `components/layout/AppHeader.tsx` - Main header component
- `components/layout/SearchCommandBar.tsx` - Search modal
- `components/layout/ProfileDropdown.tsx` - Profile menu
- `components/layout/ThemeToggle.tsx` - Theme toggle button
- `components/glass/GlassCard.tsx` - Glass card component
- `components/glass/GlassModal.tsx` - Glass modal overlay

### Modified Files

- `components/glass/GlassPanel.tsx` - Enhance với GlassViewNative
- `components/ui/icon-symbol.tsx` - Add new icon mappings
- `app/(tabs)/_layout.tsx` - Integrate AppHeader
- `components/layout/index.ts` - Export new components

## Testing Checklist

- [ ] AppHeader renders correctly với glass effect
- [ ] Title updates dynamically based on route
- [ ] Back button works và only shows when needed
- [ ] Search button opens search modal
- [ ] Profile dropdown shows user info và menu
- [ ] Theme toggle changes theme smoothly
- [ ] All animations work smoothly
- [ ] Safe area handled correctly
- [ ] Works on iOS và Android
- [ ] Accessible labels present
- [ ] Haptic feedback works

## Dependencies to Add

```json
{
  "react-native-reanimated": "^3.x.x", // Already installed
  "expo-blur": "~14.0.0", // Already installed
  "react-native-safe-area-context": "^4.x.x", // Already installed
  "react-native-keyboard-controller": "^1.x.x" // Already installed
}
```

## Next Steps After UI Design

1. Implement search functionality logic
2. Add profile screen
3. Add settings screen
4. Implement recent searches persistence
5. Add keyboard shortcuts (web)
6. Add accessibility improvements

### To-dos

- [x] Enhance GlassPanel, create GlassCard và GlassModal với proper glass morphism effects
- [x] Create AppHeader component với glass background, dynamic title, và action buttons
- [x] Create SearchCommandBar modal component với search input và recent searches
- [x] Create ProfileDropdown component với user avatar và menu items
- [x] Create ThemeToggle button component với animation
- [x] Add new icon mappings cho search, theme, profile, và other icons
- [x] Integrate AppHeader vào tab navigation layout

## Auth Testing Design (Login/Sign-up/Forgot Password)

### Goals

- Validate the authentication flow works end-to-end with Firebase Auth (email/password) in the current starter.
- Ensure UI/UX consistency with the new `AppHeader` and glass styling where applicable.
- Provide a repeatable manual test checklist and minimal instrumentation hooks.

### Scope

- Screens: `app/auth/login.tsx`, `app/auth/sign-up.tsx`, `app/auth/forgot-password.tsx`.
- Provider/Store: `providers/AuthProvider.tsx`, `stores/authStore.ts`.
- Integrations: `integrations/firebase.client.ts` (Firebase initialization), `services/firebase/*` (auth helpers if any).
- Navigation: Ensure auth stack vs main tabs routing is correct.

### Functional Requirements

- Email/Password sign-up creates a user and persists session across app restarts.
- Login authenticates existing users and navigates to the main tabs.
- Forgot password sends reset email and provides success/error feedback.
- Logout clears session and returns to the login screen.
- Auth state listener routes users appropriately (authenticated → tabs, unauthenticated → auth screens).

### Non-Functional Requirements

- Accessibility: Inputs have labels/hints; buttons have accessible labels.
- Error handling: Friendly, actionable messages; avoid leaking internal errors.
- Loading states: Disable buttons and show spinners while awaiting network.
- Theming: Inputs/buttons respect light/dark and glass background usage.

### UI Notes

- Header: Auth screens may hide `AppHeader` or use a minimal variant with only a title and back button (if deep-linked).
- Glass: Use `GlassCard` containers for forms to match the overall design language.

### Test Data

- Use a dedicated test email namespace, e.g. `tester+{timestamp}@example.com`.
- Strong password policy sample: `ValidPass_12345`.
- Environment: Firebase project set up per `docs/REACT_NATIVE_FIREBASE_SETUP.md` and `integrations/firebase.client.ts`.

### Flows to Validate

1) Sign-up → Auto-login → Land on tabs → Kill and relaunch app → Still logged in.
2) Logout from tabs → Return to login.
3) Login with existing account → Land on tabs.
4) Forgot password → Receive email → Reset → Login success.
5) Error states:
   - Invalid email format
   - Weak password
   - Email already in use
   - Wrong password / user not found

### Analytics (Optional)

- Log events (if analytics is enabled): `auth_signup_attempt`, `auth_signup_success`, `auth_login_attempt`, `auth_login_success`, `auth_logout`, `auth_password_reset_request`.

### Implementation/Validation Steps

1) Verify Firebase initialization
   - Confirm `integrations/firebase.client.ts` initializes Firebase app only once.
   - Ensure `GoogleService-Info.plist` (iOS) and Android configs are present.

2) Ensure AuthProvider wiring
   - `providers/AuthProvider.tsx` subscribes to Firebase Auth state changes and exposes user/session.
   - Redirect logic: If `user == null` → show auth stack; else → show main tabs.

3) Form validation & UX
   - Email validation regex; show inline errors.
   - Password policy hint; show server errors gracefully.
   - Disable submit while loading; show `Spinner`.

4) Forgot password
   - Validate email required; call `sendPasswordResetEmail`.
   - Show confirmation state and guidance to check inbox.

5) Logout action
   - Provide logout from profile dropdown; call `signOut` and verify redirect to login.

6) Persistence
   - Relaunch app to confirm session persistence via Firebase.

### Manual Test Checklist

- [ ] App launches to Login when logged out
- [ ] Sign-up creates user and navigates to tabs
- [ ] Relaunch app keeps user logged in
- [ ] Logout returns to Login
- [ ] Login with valid creds navigates to tabs
- [ ] Wrong password shows friendly error
- [ ] Existing-email sign-up shows proper error
- [ ] Forgot password sends reset email and confirms
- [ ] Buttons disable during network calls
- [ ] Accessible labels exist for inputs and buttons
- [ ] Light/Dark theme styles are correct
- [ ] Glass card styling applied to auth forms (if designed)

### Files to Review/Adjust (if needed)

- `providers/AuthProvider.tsx`: Confirm listener and routing logic.
- `app/auth/*.tsx`: Validate forms, error handling, loading states.
- `components/layout/ProfileDropdown.tsx`: Ensure `Logout` triggers `signOut` and redirect.
- `app/(tabs)/_layout.tsx` and `app/_layout.tsx`: Confirm stacks and conditional rendering based on auth state.

### Risks & Mitigations

- Misconfigured Firebase project → Follow `docs/REACT_NATIVE_FIREBASE_SETUP.md` exactly; verify bundle IDs.
- Platform differences (iOS vs Android) → Test on both simulators.
- Email delivery delays for reset → Note this in UX; allow re-request after a timeout.

