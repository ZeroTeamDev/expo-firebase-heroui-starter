# GoogleService-Info.plist Setup Guide

Created by Kien AI (leejungkiin@gmail.com)

## ⚠️ Quan Trọng: Vị Trí File

**KHÔNG** đặt `GoogleService-Info.plist` vào thư mục `ios/` vì:
- `npx expo prebuild --clean` sẽ **XÓA** toàn bộ thư mục `ios/` và tạo lại
- File sẽ bị mất mỗi khi prebuild

## ✅ Giải Pháp Đúng

### Bước 1: Đặt File Ở Root Project

Đặt file `GoogleService-Info.plist` ở **root** của project (cùng cấp với `package.json`, `app.json`):

```
expo-firebase-heroui-starter2/
├── package.json
├── app.json
├── GoogleService-Info.plist  ← ĐẶT Ở ĐÂY
├── ios/                       ← KHÔNG đặt trong đây
├── android/
└── ...
```

### Bước 2: Config Trong app.json

File `app.json` đã được config sẵn:

```json
{
  "expo": {
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "plugins": [
      "@react-native-firebase/app"
    ]
  }
}
```

Expo sẽ **tự động copy** file từ root vào `ios/rockoai/GoogleService-Info.plist` khi chạy `prebuild`.

### Bước 3: Download File Từ Firebase Console

1. Mở [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Vào **Project Settings** (⚙️) → **Your apps**
4. Tìm iOS app hoặc tạo mới nếu chưa có
5. Click vào iOS app → Download `GoogleService-Info.plist`

### Bước 4: Copy File Vào Root

```bash
# Copy file từ Downloads vào root project
cp ~/Downloads/GoogleService-Info.plist /Users/trungkientn/Dev2/Expo/expo-firebase-heroui-starter2/GoogleService-Info.plist
```

### Bước 5: Prebuild

```bash
npx expo prebuild --clean
```

Expo sẽ tự động:
- Copy `GoogleService-Info.plist` từ root vào `ios/rockoai/GoogleService-Info.plist`
- Link Firebase native SDK vào iOS project

### Bước 6: Build và Run

```bash
npx expo run:ios
```

## 📋 Checklist

- [ ] File `GoogleService-Info.plist` ở **root** project (không phải trong `ios/`)
- [ ] File có trong `.gitignore` hoặc được commit vào repo (tùy team policy)
- [ ] Config `"googleServicesFile": "./GoogleService-Info.plist"` trong `app.json`
- [ ] Plugin `"@react-native-firebase/app"` có trong `app.json` → `plugins`
- [ ] Đã chạy `npx expo prebuild --clean` sau khi copy file
- [ ] File được copy vào `ios/rockoai/GoogleService-Info.plist` sau prebuild

## 🔍 Kiểm Tra

Sau khi prebuild, kiểm tra file đã được copy:

```bash
ls -la ios/rockoai/GoogleService-Info.plist
```

Nếu file tồn tại, bạn sẽ thấy:
```
-rw-r--r--  1 user  staff  xxxx ios/rockoai/GoogleService-Info.plist
```

## ❌ Vì Sao Không Đặt Trong ios/?

Nếu bạn copy file trực tiếp vào `ios/rockoai/GoogleService-Info.plist`:

1. **Khi chạy `prebuild --clean`**:
   ```bash
   npx expo prebuild --clean
   # → Xóa toàn bộ ios/ và tạo lại
   # → File của bạn BỊ MẤT! ❌
   ```

2. **Khi commit vào git**:
   - File sẽ bị mất nếu ai đó clone repo và chạy `prebuild --clean`

## ✅ Workflow Đúng

1. **Lần đầu setup**:
   ```bash
   # 1. Download GoogleService-Info.plist từ Firebase Console
   # 2. Copy vào root project
   cp ~/Downloads/GoogleService-Info.plist ./GoogleService-Info.plist
   
   # 3. Prebuild (Expo tự động copy vào ios/)
   npx expo prebuild --clean
   
   # 4. Build và run
   npx expo run:ios
   ```

2. **Khi rebuild lại**:
   ```bash
   # File ở root vẫn còn, không bị mất
   npx expo prebuild --clean  # Expo tự động copy lại
   npx expo run:ios
   ```

3. **Khi team member clone repo**:
   ```bash
   # Nếu file đã được commit:
   git clone <repo>
   npx expo prebuild --clean  # Expo tự động copy file từ root
   
   # Nếu file KHÔNG được commit (trong .gitignore):
   # → Mỗi developer tự download từ Firebase Console
   # → Copy vào root project
   # → Prebuild
   ```

## 🔒 Security Note

**Quan trọng**: `GoogleService-Info.plist` chứa thông tin project nhưng **KHÔNG phải** là secret key. Tuy nhiên:

- **Có thể commit vào git** nếu project là private
- **Không commit** nếu project là public (thêm vào `.gitignore`)
- Mỗi developer/CI cần có file riêng từ Firebase Console

## 🐛 Troubleshooting

### Lỗi: "Path to GoogleService-Info.plist is not defined"

**Nguyên nhân**: File không tồn tại ở root hoặc path trong `app.json` sai.

**Giải pháp**:
```bash
# Kiểm tra file có ở root không
ls -la GoogleService-Info.plist

# Kiểm tra path trong app.json
cat app.json | grep googleServicesFile
```

### Lỗi: "ENOENT: no such file or directory"

**Nguyên nhân**: File không tồn tại ở vị trí được chỉ định.

**Giải pháp**:
1. Đảm bảo file ở root: `./GoogleService-Info.plist`
2. Kiểm tra path trong `app.json`: `"googleServicesFile": "./GoogleService-Info.plist"`
3. Chạy lại: `npx expo prebuild --clean`

### File Bị Mất Sau Prebuild

**Nguyên nhân**: Bạn đã copy file vào `ios/rockoai/` thay vì root.

**Giải pháp**:
1. Copy file ra root: `cp ios/rockoai/GoogleService-Info.plist ./GoogleService-Info.plist`
2. Xóa file trong `ios/`: `rm ios/rockoai/GoogleService-Info.plist` (không cần thiết)
3. Prebuild lại: `npx expo prebuild --clean`

## 📝 Tóm Tắt

- ✅ **ĐÚNG**: Đặt file ở **root** project → `./GoogleService-Info.plist`
- ❌ **SAI**: Đặt file trong `ios/` → File sẽ bị mất khi prebuild
- ✅ Expo tự động copy file từ root vào `ios/rockoai/` khi prebuild
- ✅ File ở root sẽ **KHÔNG BỊ MẤT** khi prebuild
