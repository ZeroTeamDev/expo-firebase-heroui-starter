# Native Modules Debug Guide

Created by Kien AI (leejungkiin@gmail.com)

## Problem: "Rebuild required" Still Shows After Rebuild

If you see "Pick Image (Rebuild required)" or "Pick Document (Rebuild required)" buttons even after rebuilding, follow these steps:

## Step 1: Check Console Logs

After opening the AI Example screen, check the console for debug messages:

```
[AIExample] Native modules check: { imagePicker: true/false, documentPicker: true/false, platform: 'ios' }
[AIExample] ✅ expo-image-picker loaded successfully
[AIExample] ✅ expo-document-picker loaded successfully
```

If you see error messages, note the error details.

## Step 2: Verify Plugins in app.json

Check that plugins are correctly configured:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them.",
          "cameraPermission": "The app accesses your camera to let you take photos."
        }
      ],
      "expo-document-picker"
    ]
  }
}
```

## Step 3: Clean Rebuild

Perform a complete clean rebuild:

```bash
# 1. Stop Metro bundler (Ctrl+C)

# 2. Clean build directories
npx expo prebuild --clean

# 3. Clean iOS build cache (optional but recommended)
cd ios
rm -rf Pods Podfile.lock build
pod deintegrate
pod install
cd ..

# 4. Rebuild
npx expo run:ios
```

## Step 4: Verify Native Modules Are Linked

Check if native modules are actually linked in the iOS project:

### Check Podfile

```bash
cd ios
grep -i "expo-image-picker\|expo-document-picker" Podfile
```

You should see references to these modules.

### Check Pods Installation

```bash
cd ios
ls -la Pods | grep -i "expo-image-picker\|expo-document-picker"
```

If modules are missing, run:

```bash
cd ios
pod install
cd ..
npx expo run:ios
```

## Step 5: Check Module Exports

If modules are installed but not working, verify they export the expected functions:

1. Open the app in simulator/device
2. Navigate to AI Example screen
3. Check console logs for detailed error messages

The code now logs:
- ✅ Success: Module loaded successfully
- ⚠️ Warning: Module loaded but missing exports
- ❌ Error: Failed to load module (with error details)

## Step 6: Manual Verification

If still not working, try manually importing in a test file:

Create `test-native-modules.js`:

```javascript
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

console.log('ImagePicker:', ImagePicker);
console.log('DocumentPicker:', DocumentPicker);
console.log('ImagePicker.launchImageLibraryAsync:', typeof ImagePicker.launchImageLibraryAsync);
console.log('DocumentPicker.getDocumentAsync:', typeof DocumentPicker.getDocumentAsync);
```

Import this in your app and check console output.

## Common Issues

### Issue 1: Modules Not in node_modules

**Solution:**
```bash
npm install expo-image-picker expo-document-picker
npx expo prebuild --clean
npx expo run:ios
```

### Issue 2: Pods Not Updated

**Solution:**
```bash
cd ios
pod deintegrate
rm Podfile.lock
pod install
cd ..
npx expo run:ios
```

### Issue 3: Cache Issues

**Solution:**
```bash
# Clear Metro cache
npx expo start --clear

# Clear iOS build cache
cd ios
rm -rf build DerivedData
cd ..
npx expo run:ios
```

### Issue 4: Expo SDK Version Mismatch

**Solution:**
Ensure you're using compatible versions:

```bash
npx expo install expo-image-picker expo-document-picker
```

This automatically installs versions compatible with your Expo SDK.

## Step 7: Check Runtime Errors

The updated code now provides detailed error logging. Check console for:

- `[AIExample] ❌ Failed to load expo-image-picker:` - Module loading failed
- `[AIExample] ⚠️ expo-image-picker module loaded but missing expected exports` - Module loaded but API missing

Common error messages:

1. **"Cannot find native module"** - Module not linked in native code
   - Solution: Rebuild with `npx expo prebuild --clean && npx expo run:ios`

2. **"Module not found"** - Module not installed
   - Solution: `npm install expo-image-picker expo-document-picker`

3. **"Undefined is not a function"** - Module loaded but API missing
   - Solution: Check Expo SDK compatibility, reinstall modules

## Still Not Working?

If modules still don't work after all steps:

1. **Check Expo SDK version:**
   ```bash
   npx expo --version
   ```

2. **Verify package versions in package.json:**
   ```json
   {
     "expo-image-picker": "~16.0.0",
     "expo-document-picker": "~14.0.7"
   }
   ```

3. **Try development build instead of Expo Go:**
   ```bash
   npx expo run:ios
   ```
   (Expo Go doesn't support custom native modules)

4. **Create a minimal test:**
   Create a new screen that only imports and uses these modules to isolate the issue.

5. **Check Expo community:**
   - [expo-image-picker issues](https://github.com/expo/expo/issues?q=is%3Aissue+is%3Aopen+expo-image-picker)
   - [expo-document-picker issues](https://github.com/expo/expo/issues?q=is%3Aissue+is%3Aopen+expo-document-picker)

## Success Indicators

You'll know modules are working when:

1. ✅ Console shows: `[AIExample] ✅ expo-image-picker loaded successfully`
2. ✅ Console shows: `[AIExample] ✅ expo-document-picker loaded successfully`
3. ✅ Buttons show: "Pick Image from Device" (not "Rebuild required")
4. ✅ Buttons are enabled (not disabled)
5. ✅ Tapping buttons opens the picker (not an alert)

## Note

The code now checks modules at runtime (when component mounts) instead of at module load time. This ensures modules are available even if they load asynchronously.

If you see "Rebuild required" but modules are actually installed, check the console logs - they will tell you exactly what's wrong.

