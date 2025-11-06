# Firebase Remote Config với React Native - Limitations & Solutions

Created by Kien AI (leejungkiin@gmail.com)

## Vấn đề

Firebase JS SDK (`firebase/remote-config`) không hoạt động tốt trên React Native vì:

1. **indexedDB không có**: Firebase Installations cần `indexedDB` để lưu installation ID, nhưng React Native không có indexedDB (chỉ có trên web browser)
2. **Error**: `Property 'indexedDB' doesn't exist`

## Giải pháp

### Option 1: Sử dụng @react-native-firebase/remote-config (Khuyến nghị)

**Cài đặt:**
```bash
npm install @react-native-firebase/app @react-native-firebase/remote-config
cd ios && pod install
```

**Sử dụng:**
```typescript
import remoteConfig from '@react-native-firebase/remote-config';

await remoteConfig().setDefaults({
  module_weather_enabled: false,
});

await remoteConfig().fetchAndActivate();
const value = remoteConfig().getValue('module_weather_enabled');
```

**Ưu điểm:**
- Được thiết kế cho React Native
- Không cần indexedDB
- Hoạt động tốt trên iOS/Android

**Nhược điểm:**
- Cần rebuild native code
- Không chạy trên web

### Option 2: Sử dụng Firebase REST API

**Implementation:**
```typescript
async function fetchRemoteConfig() {
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  
  const response = await fetch(
    `https://firebaseremoteconfig.googleapis.com/v1/projects/${projectId}/remoteConfig`,
    {
      headers: {
        'Authorization': `Bearer ${await getAccessToken()}`,
      },
    }
  );
  
  const data = await response.json();
  return data.parameters;
}
```

**Ưu điểm:**
- Hoạt động trên mọi platform
- Không cần native code

**Nhược điểm:**
- Cần implement authentication
- Cần handle caching manually

### Option 3: Fallback to Mock Mode (Hiện tại)

Hiện tại app đang fallback về mock mode khi Firebase fail. Điều này hoạt động tốt cho development, nhưng không có remote control.

**Ưu điểm:**
- Đơn giản, không cần thay đổi code
- Hoạt động ngay

**Nhược điểm:**
- Không có remote control
- Cần update code để thay đổi feature flags

## Khuyến nghị

### Cho Production:
Sử dụng **@react-native-firebase/remote-config** vì:
- Native implementation, performance tốt
- Được maintain tốt
- Hỗ trợ đầy đủ tính năng

### Cho Development:
Có thể tiếp tục dùng mock mode hiện tại, hoặc migrate sang React Native Firebase.

## Migration Guide

Nếu muốn migrate sang @react-native-firebase/remote-config:

1. **Cài đặt packages:**
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/remote-config
   ```

2. **Update firebase.client.ts:**
   ```typescript
   // Remove Firebase JS SDK imports
   // Add React Native Firebase imports
   import remoteConfig from '@react-native-firebase/remote-config';
   ```

3. **Update Remote Config service:**
   ```typescript
   // Replace getRemoteConfigInstance() với remoteConfig()
   // Update fetch logic để dùng React Native Firebase API
   ```

4. **Rebuild app:**
   ```bash
   cd ios && pod install
   npm run ios
   ```

## Current Status

✅ **Working**: App đang fallback về mock mode khi Firebase fail
✅ **Functional**: Module system hoạt động với default values
⚠️ **Limitation**: Không có remote control từ Firebase Console

## Next Steps

1. **Short term**: Tiếp tục dùng mock mode cho development
2. **Long term**: Migrate sang @react-native-firebase/remote-config cho production

---

**Status**: ⚠️ Firebase JS SDK không hoạt động trên React Native
**Solution**: Fallback to mock mode (working)
**Recommended**: Migrate to @react-native-firebase/remote-config for production

