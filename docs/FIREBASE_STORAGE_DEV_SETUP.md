# Firebase Storage Development Setup Guide

## Quick Setup for Development Mode

### 1. Firebase Storage Security Rules (Development)

In Firebase Console → Storage → Rules, use these rules for development:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Development rules - Allow authenticated users to upload/read
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Important:** These rules are for development only. Never use in production!

### 2. Verify Bucket Configuration

1. Go to Firebase Console → Storage
2. Verify bucket name matches your config
3. Check bucket exists and is accessible
4. Verify Firebase Storage is enabled

### 3. Test Configuration

1. Open app → Admin Panel → Storage Test
2. Click "Run Configuration Tests"
3. Review test results
4. Fix any failing tests

### 4. Common Issues

#### Issue: 404 Error - Bucket Not Found

**Solution:**
- Verify bucket exists in Firebase Console
- Check `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` in `.env`
- Ensure bucket name format is correct (e.g., `project-id.firebasestorage.app`)

#### Issue: 403 Error - Permission Denied

**Solution:**
- Check Firebase Storage security rules
- Ensure user is authenticated
- Verify rules allow uploads for authenticated users

#### Issue: Authentication Failed

**Solution:**
- Ensure user is logged in
- Check Firebase Authentication is enabled
- Verify authentication providers are configured

### 5. Testing Upload

1. Go to Storage Test screen
2. Click "Test File Upload"
3. Select a file
4. Monitor upload progress
5. Verify file appears in Firebase Console

### 6. Debugging

- Check test results in Storage Test screen
- Review console logs
- Check Firebase Console for errors
- Verify network connectivity
- Check Firebase status page

## Next Steps

After all tests pass:
1. Test with different file types
2. Test with larger files
3. Test with different users
4. Test error handling
5. Configure production security rules

