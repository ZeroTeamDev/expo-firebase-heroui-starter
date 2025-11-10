# Firebase Storage Upload via Cloud Function

Created by Kien AI (leejungkiin@gmail.com)

## Overview

Due to limitations with binary data upload in React Native (XMLHttpRequest and fetch API don't handle ArrayBuffer/Uint8Array reliably), we've implemented a Cloud Function solution for file uploads.

## Architecture

1. **Client (React Native)**: Reads file as base64 string using `expo-file-system`
2. **Cloud Function**: Receives base64 string, converts to Buffer, uploads to Firebase Storage
3. **Response**: Returns download URL to client

## Setup

### 1. Deploy Cloud Function

```bash
# Build functions
cd functions
npm run build

# Deploy
cd ..
firebase deploy --only functions:uploadFile
```

### 2. Configure Functions Region (Optional)

Set in `.env`:

```
EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION=us-central1
```

Default is `us-central1`.

## How It Works

### Upload Flow

1. Client reads file from URI using `expo-file-system` → base64 string
2. Client calls `uploadString` from Firebase Storage SDK (may fail in React Native)
3. If `uploadString` fails, client calls Cloud Function `uploadFile` with base64 data
4. Cloud Function converts base64 to Buffer and uploads to Firebase Storage
5. Cloud Function returns download URL to client
6. If Cloud Function fails, falls back to REST API (may also fail)

### Cloud Function Code

```typescript
export const uploadFile = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const { base64, storagePath, contentType, metadata } = data;

  // Convert base64 to buffer
  const buffer = Buffer.from(base64, "base64");

  // Upload to Firebase Storage
  const file = admin.storage().bucket().file(storagePath);
  await file.save(buffer, {
    metadata: { contentType, metadata },
  });

  // Get download URL
  const [downloadURL] = await file.getSignedUrl({
    action: "read",
    expires: "03-09-2491",
  });

  return { success: true, downloadURL, storagePath };
});
```

## Benefits

1. **Reliable**: Cloud Function handles binary data conversion properly
2. **Secure**: Authentication is handled by Firebase Auth
3. **Scalable**: Cloud Functions automatically scale
4. **Simple**: Client only needs to send base64 string

## Limitations

1. **Cost**: Cloud Functions have usage costs (but free tier is generous)
2. **Latency**: Additional network hop to Cloud Function
3. **Size Limit**: Cloud Functions have payload size limits (10MB for callable functions)

## Troubleshooting

### Function Not Found

1. Verify function is deployed: `firebase functions:list`
2. Check function region matches `EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION`
3. Verify Firebase project ID is correct

### Authentication Errors

1. Ensure user is authenticated before calling upload
2. Check Firebase Auth rules allow the user

### Upload Fails

1. Check Cloud Function logs: `firebase functions:log`
2. Verify Storage bucket exists and is accessible
3. Check Storage security rules allow uploads

## Alternative Solutions

If Cloud Functions don't work or you prefer a different approach:

1. **Use `react-native-blob-util`**: A library that handles binary uploads better
2. **Use native modules**: Create a native module for file upload
3. **Use a different storage service**: Consider using a service with better React Native support
