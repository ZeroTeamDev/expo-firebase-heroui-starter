# Rebuild Native Modules for File Picker

## Vấn đề

Sau khi cài đặt `expo-image-picker` và `expo-document-picker`, bạn cần rebuild app native để các native modules được link vào app.

## Giải pháp

### Bước 1: Đảm bảo GoogleService-Info.plist tồn tại

1. Tải file `GoogleService-Info.plist` từ Firebase Console:
   - Vào [Firebase Console](https://console.firebase.google.com/)
   - Chọn project của bạn
   - Project Settings → Your apps → iOS app
   - Tải file `GoogleService-Info.plist`

2. Đặt file vào thư mục `ios/`:
   ```bash
   # Copy file vào thư mục ios/
   cp ~/Downloads/GoogleService-Info.plist ios/GoogleService-Info.plist
   ```

### Bước 2: Rebuild App

**Option 1: Sử dụng Expo Development Build (Khuyên dùng)**

```bash
# 1. Prebuild để generate native code
npx expo prebuild --clean

# 2. Install pods (iOS)
cd ios && pod install && cd ..

# 3. Run app với development build
npx expo run:ios
# hoặc
npx expo run:android
```

**Option 2: Sử dụng EAS Build**

```bash
# 1. Install EAS CLI (nếu chưa có)
npm install -g eas-cli

# 2. Login EAS
eas login

# 3. Configure project
eas build:configure

# 4. Build development build
eas build --profile development --platform ios
# hoặc
eas build --profile development --platform android
```

### Bước 3: Test File Picker

Sau khi rebuild, bạn sẽ thấy các nút "Pick Image", "Pick Document", "Pick Audio", "Pick Video" trong AI Examples screen.

## Lưu ý

- **Expo Go không hỗ trợ**: Expo Go không hỗ trợ custom native modules. Bạn **phải** sử dụng development build hoặc production build.

- **Web không hỗ trợ**: File picker chỉ hoạt động trên iOS và Android, không hoạt động trên web. Trên web, bạn chỉ có thể sử dụng URL input.

- **Permissions**: App sẽ tự động yêu cầu permissions khi bạn sử dụng file picker lần đầu.

## Troubleshooting

### Lỗi "Cannot find native module"

1. Đảm bảo đã cài đặt packages:
   ```bash
   npm install
   ```

2. Đảm bảo đã rebuild app:
   ```bash
   npx expo prebuild --clean
   npx expo run:ios
   ```

3. Clear cache và rebuild:
   ```bash
   npx expo start --clear
   ```

### Lỗi GoogleService-Info.plist

Nếu gặp lỗi về `GoogleService-Info.plist`:
- Đảm bảo file tồn tại trong `ios/GoogleService-Info.plist`
- Hoặc tạm thời bỏ plugin `@react-native-firebase/app` khỏi `app.json` nếu không sử dụng React Native Firebase SDK

## Hiện tại (Tạm thời)

Code đã được cập nhật để **gracefully handle** khi native modules không có sẵn:
- File picker buttons chỉ hiển thị khi native modules có sẵn
- Bạn vẫn có thể sử dụng URL input để test các tính năng analysis
- Không có lỗi crash khi native modules không có

Sau khi rebuild app, tất cả các tính năng file picker sẽ hoạt động đầy đủ.

