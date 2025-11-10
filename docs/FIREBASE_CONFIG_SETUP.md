# Firebase Configuration Setup

Created by Kien AI (leejungkiin@gmail.com)

## Overview

Firebase configuration is now managed entirely through environment variables. No hardcoded values are used in the codebase.

## Required Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Required Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Optional Configuration
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX  # Only for web, not needed for React Native

# Authentication Settings
EXPO_PUBLIC_REQUIRE_LOGIN=true  # Set to 'false' to disable mandatory login (default: true)
```

## How to Get Firebase Config Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select **Project Settings**
5. Scroll down to **Your apps** section
6. Click on your **Web app** (or create one if you don't have one)
7. Copy the config values from the Firebase SDK snippet

The config will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXXX"  // Optional, only for web
};
```

Map these values to environment variables:

- `apiKey` → `EXPO_PUBLIC_FIREBASE_API_KEY`
- `authDomain` → `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `projectId` → `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `storageBucket` → `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `messagingSenderId` → `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `appId` → `EXPO_PUBLIC_FIREBASE_APP_ID`
- `measurementId` → `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional, web only)

## Setting Up Environment Variables

### Option 1: Create `.env` file

Create a `.env` file in the project root:

```bash
# Copy the example
cp .env.example .env

# Edit with your values
nano .env  # or use your preferred editor
```

### Option 2: Use Expo Environment Variables

Expo automatically loads `.env` files. Make sure your `.env` file is in the project root.

### Option 3: Set in CI/CD

For production deployments, set environment variables in your CI/CD platform:

- **Vercel**: Project Settings → Environment Variables
- **Expo EAS**: `eas secret:create`
- **GitHub Actions**: Repository Secrets

## Important Notes

1. **`.env` is gitignored**: Never commit `.env` files to version control. The `.gitignore` file already excludes `.env` files.

2. **Expo Public Variables**: All Firebase config variables must start with `EXPO_PUBLIC_` to be available in the client-side code.

3. **No Hardcoded Values**: The codebase no longer contains any hardcoded Firebase configuration. All values must come from environment variables.

4. **Error Messages**: If Firebase config is missing, you'll see clear error messages in the console telling you which variables are missing.

## Verification

After setting up your `.env` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
# or
expo start
```

You should see this log message when Firebase initializes successfully:

```
[Firebase] Using EXPO_PUBLIC_* env config for project: your-project-id
[Firebase] ✅ Firebase Web SDK initialized successfully
```

If you see error messages, check:

1. All required environment variables are set
2. The `.env` file is in the project root
3. You've restarted the development server after creating/updating `.env`
4. Variable names start with `EXPO_PUBLIC_`

## Troubleshooting

### "Missing required environment variables" error

**Solution**: Check that all required variables are set in your `.env` file. The error message will tell you which ones are missing.

### Firebase not initializing

**Solution**: 
1. Verify your environment variables are correct
2. Make sure you've restarted the dev server after updating `.env`
3. Check the console for specific error messages

### Variables not loading

**Solution**:
1. Ensure variable names start with `EXPO_PUBLIC_`
2. Restart the development server
3. Clear Expo cache: `expo start -c`

## Authentication Settings

### REQUIRE_LOGIN Environment Variable

The `EXPO_PUBLIC_REQUIRE_LOGIN` environment variable controls whether authentication is mandatory to access the app.

**Default behavior**: If not set, login is required (defaults to `true`)

**To disable mandatory login**:
```bash
EXPO_PUBLIC_REQUIRE_LOGIN=false
```

**How it works**:
- When `EXPO_PUBLIC_REQUIRE_LOGIN=false`: Users can access the main app without logging in
- When `EXPO_PUBLIC_REQUIRE_LOGIN=true` or not set: Users must log in to access the app

**Use cases**:
- Development/testing: Set to `false` for easier testing without authentication
- Public apps: Allow guest access to certain features
- Production: Usually set to `true` to require authentication

**Note**: Even when login is not required, users can still access authentication screens if needed. The app will simply not redirect unauthenticated users to the login screen.

## Security Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use different projects for dev/staging/prod** - Use different Firebase projects for different environments
3. **Rotate API keys if exposed** - If you accidentally commit an API key, rotate it in Firebase Console
4. **Use Firebase App Check** - Enable App Check in production to protect your backend resources
5. **Require login in production** - Set `EXPO_PUBLIC_REQUIRE_LOGIN=true` for production environments to enforce authentication

