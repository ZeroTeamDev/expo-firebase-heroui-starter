# Firebase Functions Deployment Guide

## Prerequisites

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Login to Firebase:

```bash
firebase login
```

3. Install functions dependencies:

```bash
cd functions
npm install
```

## Deployment Steps

### 1. Build Functions (Required)

**Important**: Build functions trước khi deploy:

```bash
cd functions
npm run build
cd ..
```

Verify build thành công:

```bash
ls -la functions/dist/  # Should see compiled .js files
```

### 2. Deploy Functions

From the project root:

```bash
firebase deploy --only functions
```

Or deploy specific functions:

```bash
firebase deploy --only functions:aiChat
firebase deploy --only functions:aiVision
firebase deploy --only functions:aiSpeech
```

### 3. Verify Deployment

After deployment, you'll see the function URLs in the console output. They will be in the format:

```
https://us-central1-demosdk-1756a.cloudfunctions.net/aiChat
https://us-central1-demosdk-1756a.cloudfunctions.net/aiVision
https://us-central1-demosdk-1756a.cloudfunctions.net/aiSpeech
```

## Environment Variables

### Gemini API Key

**Firebase Functions tự động sử dụng credentials khi deploy.** Không cần set API key thủ công trong production.

#### Production (Deployed)

Khi deploy Firebase Functions, Firebase tự động cung cấp Google Cloud credentials. Functions sẽ tự động sử dụng credentials này để authenticate với Gemini API.

**Không cần làm gì thêm** - chỉ cần deploy:

```bash
# Build trước
cd functions && npm run build && cd ..

# Deploy
firebase deploy --only functions
```

#### Local Development

Để test locally với Firebase emulator, bạn có thể set `GEMINI_API_KEY` trong `.env` file:

```bash
cd functions
echo "GEMINI_API_KEY=YOUR_GEMINI_API_KEY" > .env
```

**Lưu ý**: File `.env` chỉ dùng cho local development. Trong production, Firebase tự động cung cấp credentials.

#### Get Your Gemini API Key (for local testing only)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key và sử dụng trong `.env` file cho local development

## Local Testing

To test functions locally:

```bash
cd functions
npm run serve
```

This will start the Firebase emulator. Functions will be available at:

```
http://localhost:5001/demosdk-1756a/us-central1/aiChat
```

## Troubleshooting

### Build Errors

1. Make sure TypeScript is installed:

```bash
cd functions
npm install
```

2. Check TypeScript configuration in `functions/tsconfig.json`

3. Build manually:

```bash
cd functions
npm run build
```

### Deploy Errors

#### "Cannot read properties of undefined (reading 'stdin')"

Lỗi này xảy ra khi Firebase CLI cố gắng chạy predeploy script.

**Giải pháp**: Build functions trước khi deploy:

```bash
# Build trước
cd functions
npm run build
cd ..

# Deploy (predeploy đã được tắt trong firebase.json)
firebase deploy --only functions
```

### 404 Errors

1. Make sure functions are deployed:

```bash
firebase functions:list
```

2. Check function URLs match the project ID in `.firebaserc`

3. Verify the region matches in `services/firebase/functions.ts` (default is `us-central1`)

### CORS Errors

Functions are configured with CORS enabled. If you still see CORS errors:

1. Check that `cors: true` is set in function configuration
2. Verify Access-Control headers are set in function responses
3. Ensure OPTIONS requests are handled correctly

## Project Configuration

- **Project ID**: `demosdk-1756a` (in `.firebaserc`)
- **Region**: `us-central1` (default, can be changed via `EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION`)
- **Node Version**: 20 (in `functions/package.json`)
- **Runtime**: nodejs20 (in `firebase.json`)

## Quick Deploy Command

```bash
# One-liner để build và deploy
cd functions && npm run build && cd .. && firebase deploy --only functions
```
