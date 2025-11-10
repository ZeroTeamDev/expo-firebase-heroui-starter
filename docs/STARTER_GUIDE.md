# Expo Firebase + HeroUI Starter — Complete Guide

This guide gives you a clear, practical overview of the starter kit: what’s inside, how pieces fit together, and the recommended ways to extend it safely.

## Purpose
- Ship a production-ready Expo app with Firebase and modular features.
- Provide consistent patterns for UI, state, data, and integrations.
- Make adding new modules, screens, stores, and services straightforward.

## Quick Start
- Prerequisites: `Node 18+`, `Yarn` or `npm`, an active Firebase project.
- Install dependencies: `yarn` or `npm install`.
- Configure environment: copy `.env.example` to `.env` and fill values.
- Firebase: update `.firebaserc` and `firebase.json` as needed.
- Run app: `yarn expo start` (or `npx expo start`).

## Tech Stack
- Expo Router for navigation and modular routing.
- Firebase: Auth, Firestore, Storage, Functions (cloud functions under `functions/`).
- Tailwind/NativeWind for styling and theme utilities.
- TypeScript everywhere.
- Testing scaffold under `__tests__/` for components.

## Core Features
- Authentication flow (login, signup, action handlers).
- Modular routing via `app/` with tabs and nested modules.
- Centralized hooks for AI, config, analytics, files, users, groups, Firestore.
- Services layer (`services/`) abstracts integrations and data access.
- Global state stores in `stores/` for auth, config, AI, modules.
- UI theme and reusable components under `components/` and `constants/theme.ts`.
- Remote Config and permissions helpers.
- Example modules to kickstart feature development.

## Directory Overview
- `app/`: Screens, layouts, and modules. Expo Router folders like `(tabs)` and `auth`.
- `components/`: Reusable UI blocks and feature-specific components.
- `hooks/`: Shared hooks for data, integrations, and app behaviors.
- `services/`: Integration clients and domain services (AI, users, files, etc.).
- `stores/`: Global state (Zustand or similar) for core app slices.
- `modules/`: Feature modules (ai-tools, management, saas, weather, etc.).
- `docs/`: Project documentation, architecture, and component references.
- `functions/`: Firebase Cloud Functions (TypeScript) setup.
- `providers/`, `integrations/`, `utils/`: Helpers and cross-cutting concerns.

## Runtime Flows
- App start: `app/_layout.tsx` sets app-level layout and providers.
- Tabs: `app/(tabs)/_layout.tsx` defines bottom tabs and routes.
- Auth: `app/auth` includes `login.tsx`, `sign-up.tsx`, `action.tsx`, and `_layout.tsx`.
- Modules: `app/modules` and `modules/` define feature entry points routed by Expo Router.
- Data access: go through `hooks/` (e.g., `use-firestore.ts`) and `services/` to keep components lean.

## Configuration
- `.env.example`: clone to `.env` and set Firebase keys, API endpoints, feature flags.
- `app.json`: Expo configuration, app name, icons, and platform settings.
- `firebase.json`: Firebase hosting/functions rules and project-level configs.
- `.firebaserc`: maps local project to Firebase project alias.
- `tailwind.config.js`: styling tokens and theme configuration.

## Firebase Setup
- Create a Firebase project and web app; copy SDK config to `.env`.
- Enable Firebase Auth providers as needed (Email/Password, OAuth).
- Create Firestore database (Native/Datastore) and security rules.
- Configure Storage for file uploads and access rules.
- Deploy/update functions under `functions/` using `firebase-tools` when required.

## UI Toolkit & Patterns
- Use components under `components/ui` and related folders for consistent UI.
- Theme tokens from `constants/theme.ts` unify colors, spacing, shadows.
- Follow the design docs in `docs/ui-components.md` and existing examples under `app/modules/examples`.

## Hooks (selected)
- `hooks/use-ai.ts`: Bridge to AI services and store.
- `hooks/use-alert.ts`: Standardized alerts/snackbar patterns.
- `hooks/use-analytics.ts`: Track events in a unified way.
- `hooks/use-config.ts`: Read remote/local config and feature flags.
- `hooks/use-files.ts`: File interactions, uploads, and storage.
- `hooks/use-firestore.ts`: Query helpers and CRUD wrappers.
- `hooks/use-groups.ts`: Group management helpers.
- `hooks/use-modules.ts`: Module discovery and enablement.
- `hooks/use-users.ts`: User profile and auth helpers.

## Services (selected)
- `services/ai`: AI client, types, and orchestration.
- `services/files`: File service interface (`index.ts`).
- `services/users`: User service (`index.ts`).
- `services/remote-config`: Remote Config abstraction.
- `services/firebase`: Firebase initialization and helpers.

## Stores
- `stores/authStore.ts`: Auth state and session info.
- `stores/configStore.ts`: Feature flags and configuration.
- `stores/aiStore.ts`: AI session and tool state.
- `stores/moduleStore.ts`: Dynamic modules registry and visibility.

## Modules
- `modules/ai-tools`: AI features and tool experiences.
- `modules/dev-tools`: Developer utilities/examples.
- `modules/management`: Admin/management features.
- `modules/saas`: SaaS-oriented flows.
- `modules/weather`: Example data module.

## Testing
- `__tests__/components`: Component tests scaffold.
- Add tests close to components/services; prefer fast, focused unit tests.

## Adding a New Screen
1. Create a file under `app/` or `app/(tabs)/` based on navigation.
2. Use hooks/services; avoid direct SDK calls in components.
3. Add any new strings and messages to your i18n resources if applicable.
4. Keep components presentational; push logic into hooks/services.

## Adding a New Module
1. Create a folder under `modules/<your-module>` and add an `index.ts`.
2. Add an entry screen under `app/modules/<your-module>/index.tsx` or a route as needed.
3. Register icons and routing in `modules/index.ts` and `modules/icon-map.ts` if applicable.
4. Use `stores/moduleStore.ts` to toggle enablement/visibility.

## Adding a New Service
1. Create `services/<domain>/index.ts` with clear interfaces and error handling.
2. Add types under `services/<domain>/types.ts` if needed.
3. Wrap external SDK calls; expose clean methods to hooks/components.
4. Document usage in `docs/functions.md` or a dedicated service doc.

## Remote Config & Feature Flags
- Manage flags with `services/remote-config` and `hooks/use-config.ts`.
- Gate features at the module and screen level for safe rollout.

## Permissions & Auth
- Helpers under `utils/permissions.ts` simplify platform permission requests.
- Auth flows live in `app/auth`; keep UI decoupled from auth logic.

## Files & Storage
- Use `hooks/use-files.ts` and `services/files` for uploads and downloads.
- Respect Storage security rules; never embed secrets client-side.

## Error Handling
- Handle errors in services; return typed results to hooks.
- Surface user-friendly messages via `use-alert`.
- Log important events and use analytics where appropriate.

## Code Standards
- SOLID principles, small focused functions, meaningful names.
- English-only for code, comments, and docs.
- Avoid leaking SDK details into UI components.

## Roadmap Ideas
- Push notifications and background tasks.
- Offline-first caching and sync.
- Payments and subscriptions integration.
- Advanced AI workflows with tool orchestration.
- Admin dashboards and role-based features.

## Troubleshooting
- Build issues: check `metro.config.js`, `babel.config.js`, and TypeScript paths.
- iOS crashes: see `docs/IOS_CRASH_FIX.md`.
- Firebase auth errors: validate `.env` values and provider settings.
- Styling glitches: confirm `nativewind-env.d.ts` and `tailwind.config.js`.

## Conventions & Glossary
- "Module": feature grouping across `modules/` and `app/modules/`.
- "Service": reusable integration layer under `services/`.
- "Store": global state slice under `stores/`.
- "Hook": reusable logic under `hooks/` for UI consumption.

## Keep Docs in Sync
- Any significant change should update `docs/` and rule files.
- Prefer adding a short note to `Decisions.md` for important design choices.