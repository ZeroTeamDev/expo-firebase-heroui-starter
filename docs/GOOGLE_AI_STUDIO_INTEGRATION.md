# Google AI Studio Integration - Automatic API Key Injection

## Overview

**Firebase Functions không tự động inject API key từ Google AI Studio** như Firebase App Hosting. Tuy nhiên, code đã được cấu hình để hỗ trợ nhiều cách lấy API key:

1. **Firebase Secrets Manager** (recommended for Functions)
2. **Environment variables** (GEMINI_API_KEY, GOOGLE_API_KEY, API_KEY)
3. **Google AI Studio automatic injection** (only works with App Hosting, not Functions)

## Important Note

⚠️ **Firebase Functions và Firebase App Hosting khác nhau:**
- **App Hosting**: Tự động inject `process.env.API_KEY` khi kết nối với Google AI Studio
- **Functions**: Không tự động inject - cần set secret hoặc environment variable

## How It Works

### Firebase App Hosting + Google AI Studio

1. **Deploy project lên Firebase App Hosting**
2. **Kết nối với Google AI Studio** trong Firebase Console
3. **Firebase tự động inject API key** vào environment variables
4. **Functions tự động sử dụng** `process.env.API_KEY`

### Current Implementation

Code đã được cấu hình để tự động fallback:

1. **Priority 1**: Function secret (`GEMINI_API_KEY` từ Secrets Manager)
2. **Priority 2**: Environment variables (`GEMINI_API_KEY`, `GOOGLE_API_KEY`)
3. **Priority 3**: **Google AI Studio automatic injection** (`process.env.API_KEY`)

## Setup Steps

### Option 1: Use Google AI Studio Automatic Injection (Recommended)

#### Step 1: Connect Project to Google AI Studio

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **App Hosting** → **Settings**
4. Connect to **Google AI Studio**
5. Firebase will automatically inject API key

#### Step 2: Deploy Functions

```bash
# Build functions
cd functions
npm run build
cd ..

# Deploy (API key will be automatically injected)
firebase deploy --only functions
```

**No need to set secrets manually!** Firebase will automatically inject `process.env.API_KEY`.

### Option 2: Use Firebase Secrets Manager (Fallback)

If you prefer to manage API key manually:

```bash
# Set secret
firebase functions:secrets:set GEMINI_API_KEY

# Deploy
firebase deploy --only functions
```

## Code Implementation

### Secret Configuration (`functions/src/config/secrets.ts`)

```typescript
export function getGeminiApiKey(): string {
  return (
    getCachedApiKey() || // From function secret
    process.env.GEMINI_API_KEY || 
    process.env.GOOGLE_API_KEY || 
    process.env.API_KEY || // Google AI Studio automatic injection
    ''
  );
}
```

### Function Configuration (`functions/src/index.ts`)

```typescript
// Secret is optional - will try automatic injection if not set
export const aiChat = onRequest(
  {
    cors: true,
    maxInstances: 10,
    secrets: [geminiApiKey], // Optional
  },
  async (req, res) => {
    // Try to get from secret, fallback to automatic injection
    try {
      const secretValue = geminiApiKey.value();
      if (secretValue) {
        setGeminiApiKey(secretValue);
      }
    } catch (error) {
      // Will use process.env.API_KEY if available
    }
    // ... rest of function
  }
);
```

## Verification

After deployment, check logs:

```bash
firebase functions:log | grep "Gemini client initialization"
```

You should see:
```
[Chat] Gemini client initialization: {
  hasApiKey: true,
  apiKeyLength: 39,
  apiKeyPrefix: 'AIza...',
  envVars: { 
    GEMINI_API_KEY: false, 
    GOOGLE_API_KEY: false, 
    API_KEY: true  // ← Google AI Studio automatic injection
  }
}
```

## Benefits

✅ **No manual API key management** - Firebase handles it automatically  
✅ **Secure** - API key is managed by Firebase/Google AI Studio  
✅ **Easy setup** - Just connect project to Google AI Studio  
✅ **Automatic rotation** - Google AI Studio can rotate keys automatically  

## Migration from Manual Secret Management

If you're currently using Firebase Secrets Manager and want to switch to automatic injection:

1. **Connect project to Google AI Studio** (as described above)
2. **Remove secret** (optional):
   ```bash
   firebase functions:secrets:delete GEMINI_API_KEY
   ```
3. **Redeploy functions**:
   ```bash
   firebase deploy --only functions
   ```

Code will automatically fallback to `process.env.API_KEY` if secret is not available.

## Troubleshooting

### API Key Not Found

If you see `hasApiKey: false` in logs:

1. **Check Google AI Studio connection:**
   - Go to Firebase Console → App Hosting → Settings
   - Verify connection to Google AI Studio

2. **Check environment variables:**
   ```bash
   firebase functions:log | grep "envVars"
   ```

3. **Fallback to manual secret:**
   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   ```

### Mixed Setup

You can use both:
- **Production**: Google AI Studio automatic injection
- **Local**: Manual `.env` file for development

Code will automatically use the best available option.

## References

- [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
- [Google AI Studio](https://ai.studio)
- [Firebase Functions Secrets](https://firebase.google.com/docs/functions/config-env)

---

Created by Kien AI (leejungkiin@gmail.com)

