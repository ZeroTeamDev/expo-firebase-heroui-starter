# Firebase Storage Test Guide

## Overview

This guide explains how to test Firebase Storage configuration and upload functionality in development mode.

## Quick Test Script

### Option 1: Run Test Script Directly

Create a test screen in your app and import the test function:

```typescript
import { runFirebaseStorageTests } from '@/scripts/test-firebase-storage';

// In your component
await runFirebaseStorageTests();
```

### Option 2: Add Test Screen to App

1. Import `StorageTestScreen` component:
```typescript
import StorageTestScreen from '@/scripts/test-storage-upload';
```

2. Add to your navigation (e.g., in Settings screen):
```typescript
// Add a button to open test screen
<TouchableOpacity onPress={() => router.push('/storage-test')}>
  <Text>Test Firebase Storage</Text>
</TouchableOpacity>
```

3. Create test route in your app:
```typescript
// app/storage-test.tsx
import StorageTestScreen from '@/scripts/test-storage-upload';

export default StorageTestScreen;
```

## What the Tests Check

### 1. Firebase App Initialization
- Verifies Firebase app is properly initialized
- Checks app ID and project ID

### 2. Storage Bucket Configuration
- Verifies storage bucket is configured
- Extracts bucket ID from full bucket name
- Checks bucket format (with or without domain)

### 3. Authentication
- Verifies user is authenticated
- Checks ID token is available
- Validates token length

### 4. Storage Instance
- Creates Firebase Storage instance
- Verifies instance is valid

### 5. Bucket Access
- Tests if bucket exists and is accessible
- Checks authentication permissions
- Verifies bucket ID is correct

### 6. Upload URL Format
- Validates resumable upload URL format
- Validates multipart upload URL format
- Checks path encoding

### 7. Storage Security Rules
- Tests if security rules allow uploads
- Verifies user can upload to their own folder
- Checks for 403/404 errors

### 8. Small File Upload
- Tests actual file upload using resumable API
- Uploads a test file
- Verifies upload success

## Common Issues and Solutions

### Issue 1: 404 Error - Bucket Not Found

**Symptoms:**
- All upload attempts return 404
- Bucket access test fails

**Solutions:**
1. Verify bucket exists in Firebase Console
2. Check bucket ID in Firebase config
3. Ensure Firebase Storage is enabled for your project
4. Verify `storageBucket` in Firebase config matches console

### Issue 2: 403 Error - Permission Denied

**Symptoms:**
- Upload fails with 403 Forbidden
- Security rules test fails

**Solutions:**
1. Check Firebase Storage security rules in Console
2. Ensure rules allow authenticated users to upload
3. Example rule:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Issue 3: Authentication Issues

**Symptoms:**
- Authentication test fails
- No user ID token available

**Solutions:**
1. Ensure user is logged in
2. Check Firebase Authentication configuration
3. Verify authentication providers are enabled
4. Check if token expiration is an issue

### Issue 4: Bucket ID Format Issues

**Symptoms:**
- Bucket access fails
- Upload URLs are malformed

**Solutions:**
1. Verify bucket format in config
2. Check if bucket has domain (`.firebasestorage.app`)
3. Ensure bucket ID extraction is correct
4. Test with both full domain and ID only

## Firebase Console Checklist

### Storage Setup
- [ ] Firebase Storage is enabled
- [ ] Bucket is created
- [ ] Bucket name matches config
- [ ] Storage rules are configured
- [ ] Rules allow authenticated uploads

### Authentication Setup
- [ ] Authentication is enabled
- [ ] User is logged in
- [ ] User has valid ID token
- [ ] Token is not expired

### Configuration
- [ ] `google-services.json` (Android) is up to date
- [ ] `GoogleService-Info.plist` (iOS) is up to date
- [ ] `storageBucket` in config matches console
- [ ] Firebase project ID is correct

## Development Mode Security Rules

For development, you can use more permissive rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload anywhere (DEV ONLY)
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Warning:** Never use these rules in production!

## Testing Upload Functionality

### Manual Test
1. Run the test script
2. Check all tests pass
3. Try uploading a small file
4. Verify file appears in Firebase Console
5. Check download URL works

### Automated Test
1. Import test function in your app
2. Call `runFirebaseStorageTests()`
3. Check test results
4. Fix any failing tests
5. Retry until all tests pass

## Debugging Tips

### Enable Detailed Logging
```typescript
// In storage.service.ts
if (__DEV__) {
  console.log('[Storage] Detailed logs enabled');
}
```

### Check Network Requests
- Use browser DevTools (for web)
- Use React Native Debugger (for mobile)
- Check Firebase Console logs
- Monitor network tab for API calls

### Verify Token
```typescript
const authInstance = getAuthInstance();
const token = await authInstance.currentUser?.getIdToken();
console.log('Token:', token?.substring(0, 20) + '...');
```

### Test Bucket Access
```typescript
const bucketId = 'your-bucket-id';
const testUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketId}/o`;
// Check if this URL is accessible
```

## Next Steps

After all tests pass:
1. Test with larger files
2. Test with different file types
3. Test with different users
4. Test error handling
5. Test progress tracking
6. Test download functionality

## Support

If tests continue to fail:
1. Check Firebase Console for errors
2. Verify all configuration files
3. Check network connectivity
4. Review Firebase Storage documentation
5. Check Firebase status page for outages

## References

- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Storage REST API](https://firebase.google.com/docs/storage/rest)
- [Firebase Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [React Native Firebase](https://rnfirebase.io/storage/usage)

