# React Native Firebase Setup Guide

Created by Kien AI (leejungkiin@gmail.com)

## Vấn đề

Sau khi cài đặt `@react-native-firebase/remote-config`, bạn sẽ gặp lỗi:
```
Native module RNFBAppModule not found
```

Đây là lỗi bình thường - cần rebuild app để native modules được link.

## Giải pháp: Rebuild App

### Bước 1: Stop Dev Server

Nếu đang chạy dev server, stop nó (Ctrl+C)

### Bước 2: Rebuild iOS App

```bash
# Clean build
cd ios
rm -rf build Pods Podfile.lock
cd ..

# Reinstall pods
cd ios
pod install
cd ..

# Rebuild app
npx expo run:ios
```

Hoặc đơn giản hơn:

```bash
npx expo run:ios
```

Expo sẽ tự động:
- Install pods
- Rebuild native code
- Start app với native modules mới

### Bước 3: Verify

Sau khi rebuild, bạn sẽ thấy logs:
- `[Firebase Remote Config] ✅ Initialized with React Native Firebase`
- `[Firebase Remote Config] ✅ Fetched and activated new values`

## Lưu ý

1. **First build sẽ mất thời gian** - Có thể 5-10 phút
2. **Cần internet connection** - Để download dependencies
3. **Xcode cần được cài đặt** - Cho iOS development

## Troubleshooting

### Lỗi Pod Install

Nếu gặp lỗi khi install pods:

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Lỗi Build

Nếu build fail:

```bash
# Clean everything
cd ios
rm -rf build DerivedData
cd ..

# Rebuild
npx expo run:ios --clean
```

### Module Still Not Found

Nếu vẫn gặp lỗi "Native module not found":

1. **Check app.json** - Đảm bảo có `@react-native-firebase/app` trong plugins
2. **Check Podfile** - Đảm bảo có `use_modular_headers!`
3. **Rebuild completely**:

```bash
rm -rf node_modules ios/Pods ios/build
npm install
cd ios && pod install && cd ..
npx expo run:ios
```

## Firebase Configuration

React Native Firebase sử dụng `google-services.json` (Android) và `GoogleService-Info.plist` (iOS).

### iOS Setup

1. Download `GoogleService-Info.plist` từ Firebase Console
2. Add vào `ios/rockoai/GoogleService-Info.plist`
3. Đảm bảo file được add vào Xcode project

### Android Setup

1. Download `google-services.json` từ Firebase Console
2. Add vào `android/app/google-services.json`
3. Đảm bảo `google-services` plugin được add vào `android/build.gradle`

## Verify Setup

Sau khi rebuild, check logs:

```bash
# Look for these logs:
[Firebase Remote Config] ✅ Initialized with React Native Firebase
[Firebase Remote Config] Defaults set: 10 keys
[Firebase Remote Config] ✅ Fetched and activated new values
```

## Next Steps

1. ✅ Rebuild app
2. ✅ Verify logs
3. ✅ Test Remote Config fetch
4. ✅ Enable modules từ Firebase Console

---

**Status**: ⚠️ Cần rebuild app để native modules hoạt động
**Command**: `npx expo run:ios`

