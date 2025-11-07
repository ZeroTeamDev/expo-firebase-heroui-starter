# Rebuild App for Native Modules

Created by Kien AI (leejungkiin@gmail.com)

## Vấn đề

Bạn thấy warning trong console:
```
[AIExample] ⚠️ expo-image-picker module loaded but missing expected exports: 
{hasModule: false, hasLaunchImageLibraryAsync: undefined, exports: Array(0)}
```

Điều này có nghĩa là:
- ✅ Module JavaScript được require thành công
- ❌ Native module `ExponentImagePicker` chưa được link vào app binary
- ❌ App cần được rebuild để native modules hoạt động

## Giải pháp: Rebuild App

### Bước 1: Dừng Metro Bundler

Nếu Metro bundler đang chạy, dừng nó (Ctrl+C trong terminal).

### Bước 2: Clean và Rebuild

```bash
# Option 1: Sử dụng script (Khuyên dùng)
npm run rebuild:native

# Option 2: Rebuild thủ công
npx expo prebuild --clean
cd ios && arch -arm64 pod install && cd ..
```

### Bước 3: Build và Run App

```bash
# Build và chạy app trên iOS
npx expo run:ios

# Hoặc build và chạy app trên Android
npx expo run:android
```

**Lưu ý quan trọng:**
- ⚠️ **KHÔNG** sử dụng Expo Go - Expo Go không hỗ trợ custom native modules
- ✅ **PHẢI** sử dụng development build (`npx expo run:ios` hoặc `npx expo run:android`)
- ✅ Native modules chỉ hoạt động sau khi app được rebuild

## Tại sao cần rebuild?

1. **Native modules** như `expo-image-picker` và `expo-document-picker` cần được compile vào app binary
2. **Pod install** chỉ cài đặt dependencies, nhưng không build app
3. **App binary** cần được rebuild để link native modules vào

## Kiểm tra sau khi rebuild

Sau khi rebuild, bạn sẽ thấy trong console:

```
[AIExample] ✅ expo-image-picker loaded successfully
[AIExample] ✅ expo-document-picker loaded successfully
[AIExample] Native modules check: {imagePicker: true, documentPicker: true, platform: 'ios'}
```

Và các nút sẽ enable:
- ✅ "Pick Image from Device" (không còn "Rebuild required")
- ✅ "Pick Document from Device" (không còn "Rebuild required")

## Troubleshooting

### Vẫn thấy warning sau khi rebuild

1. **Kiểm tra app đã được rebuild chưa:**
   ```bash
   # Xem build time
   ls -la ios/build/
   ```

2. **Clean build cache:**
   ```bash
   cd ios
   rm -rf build DerivedData
   cd ..
   npx expo run:ios --clean
   ```

3. **Kiểm tra pods:**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   npx expo run:ios
   ```

### App không build được

1. **Kiểm tra Xcode version:**
   ```bash
   xcodebuild -version
   ```
   Cần Xcode 15.0+ cho Expo SDK 54

2. **Kiểm tra CocoaPods:**
   ```bash
   pod --version
   ```
   Cần CocoaPods 1.13.0+

3. **Kiểm tra Node version:**
   ```bash
   node --version
   ```
   Cần Node.js 18.0+

## Lưu ý

- **Development builds** cần được rebuild mỗi khi thêm native modules mới
- **Production builds** cũng cần rebuild với native modules
- **Expo Go** không hỗ trợ custom native modules - phải dùng development build
- **Web** không hỗ trợ file pickers - chỉ iOS và Android

## Tóm tắt

1. ✅ Pods đã được install (đã làm)
2. ⏳ **App cần được rebuild** (đang làm)
3. ✅ Sau khi rebuild, native modules sẽ hoạt động

**Next step:** Chạy `npx expo run:ios` để rebuild app với native modules.

