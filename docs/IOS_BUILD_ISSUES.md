# iOS Build Issues Troubleshooting

Created by Kien AI (leejungkiin@gmail.com)

## Current Issue: ExpoAppDelegate Not Found

### Problem

When building for iOS, you may encounter:
```
error: cannot find 'ExpoAppDelegate' in scope
FileSystemModule.swift:10:84: error: cannot find 'ExpoAppDelegate' in scope
```

This happens because `expo-file-system` module tries to access `ExpoAppDelegate.getSubscriberOfType()`, but the class is not accessible during compilation.

### Root Cause

This is a known issue with Expo SDK 54 and how `ExpoAppDelegate` is exported/imported in Swift modules. The `expo-file-system` module expects `ExpoAppDelegate` to be accessible, but the module visibility might not be set up correctly.

### Solutions

#### Solution 1: Wait for Build to Complete

The build process is currently running and may complete successfully despite the warning. Check the final build output.

#### Solution 2: Use Workaround (Already Implemented)

We've already added a fallback in `services/ai/document-client.ts` that doesn't require `expo-file-system` to work. The function `fileUriToBase64()` will:
1. Try to use `expo-file-system` if available
2. Fall back to `fetch()` API if `expo-file-system` is not available

This means:
- **On Web**: Always uses `fetch()`
- **On React Native**: Tries `expo-file-system` first, falls back to `fetch()` if not available

#### Solution 3: Temporary Disable expo-file-system

If you don't need `expo-file-system` functionality right now, you can:

1. Remove from `package.json`:
   ```bash
   npm uninstall expo-file-system
   ```

2. Remove from `app.json` plugins (if present):
   ```json
   {
     "plugins": [
       // Remove "expo-file-system" if present
     ]
   }
   ```

3. Clean and rebuild:
   ```bash
   npx expo prebuild --clean --platform ios
   cd ios && pod install && cd ..
   npm run ios
   ```

#### Solution 4: Update Expo SDK (If Available)

Check if there's a newer version of Expo SDK that fixes this issue:

```bash
npx expo install expo@latest
npx expo install expo-file-system@latest
```

### Build Performance

iOS builds can take 5-15 minutes or more, especially the first build. This is normal. The build process:
1. Compiles all native dependencies
2. Links Swift and Objective-C modules
3. Builds React Native bridge
4. Compiles your app code

**If the terminal appears "hung", it's likely just compiling in the background.**

### How to Check Build Progress

1. **Check processes**:
   ```bash
   ps aux | grep -E "xcodebuild|clang" | wc -l
   ```
   If this shows multiple processes, the build is still running.

2. **Check Xcode DerivedData**:
   ```bash
   ls -la ~/Library/Developer/Xcode/DerivedData/rockoai-*/
   ```
   If files are being updated, the build is progressing.

3. **Open Xcode**:
   Open `ios/rockoai.xcworkspace` in Xcode and watch the build progress in the navigator.

### Current Status

- ✅ Podfile configured with modular headers for Firebase and SDWebImage
- ✅ AppDelegate imports `ExpoModulesCore`
- ✅ Fallback implemented in `document-client.ts` for file operations
- ⏳ Build in progress (may take 10-15 minutes)

### Next Steps

1. Wait for the current build to complete
2. Check the final error message (if any)
3. If build succeeds, test the app
4. If build fails with `ExpoAppDelegate` error, try Solution 3 (disable expo-file-system) or Solution 4 (update Expo SDK)

### Related Files

- `ios/rockoai/AppDelegate.swift` - App delegate with Expo imports
- `ios/Podfile` - Pod configuration with modular headers
- `services/ai/document-client.ts` - File operations with fallback
- `app.json` - Expo configuration

