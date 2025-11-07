# Android google-services.json Setup

Created by Kien AI (leejungkiin@gmail.com)

## ⚠️ Tạm Thời: Placeholder File

Hiện tại đã tạo file `google-services.json` placeholder để prebuild có thể chạy được.

## ✅ Cách Lấy File Thật

### Bước 1: Download từ Firebase Console

1. Mở [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Vào **Project Settings** (⚙️) → **Your apps**
4. Tìm **Android app** hoặc tạo mới nếu chưa có:
   - Package name: `com.leejungkiin.rockoai`
5. Click vào Android app → Download `google-services.json`

### Bước 2: Thay Thế Placeholder

```bash
# Copy file từ Downloads vào root project
cp ~/Downloads/google-services.json /Users/trungkientn/Dev2/Expo/expo-firebase-heroui-starter2/google-services.json
```

### Bước 3: Prebuild Lại

```bash
npx expo prebuild --clean
npx expo run:android
```

## 📝 Lưu Ý

- File `google-services.json` cần ở **root** project (không phải trong `android/`)
- Expo tự động copy file vào `android/app/` khi prebuild
- Nếu không cần Android, bạn có thể bỏ qua file này (nhưng sẽ cần config plugin để skip Android)

## 🔍 Kiểm Tra

Sau khi prebuild, kiểm tra file đã được copy:

```bash
ls -la android/app/google-services.json
```

