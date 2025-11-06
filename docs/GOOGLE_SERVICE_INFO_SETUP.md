# GoogleService-Info.plist Setup Guide

Created by Kien AI (leejungkiin@gmail.com)

## Vấn đề

React Native Firebase cần `GoogleService-Info.plist` để tự động initialize Firebase app. Nếu không có file này, bạn sẽ thấy lỗi:

```
No Firebase App '[DEFAULT]' has been created
```

## Giải pháp

### Bước 1: Download GoogleService-Info.plist

1. Mở [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Vào **Project Settings** (⚙️ icon)
4. Scroll xuống **Your apps** section
5. Chọn iOS app (hoặc tạo mới nếu chưa có)
6. Download `GoogleService-Info.plist`

### Bước 2: Add vào iOS Project

1. Copy file `GoogleService-Info.plist` vào `ios/rockoai/`
   ```bash
   cp ios/GoogleService-Info.plist ios/rockoai/GoogleService-Info.plist
   ```

2. Mở Xcode project: `ios/rockoai.xcworkspace`
3. Right-click vào folder `rockoai` trong Xcode
4. Chọn **Add Files to "rockoai"...**
5. Chọn `GoogleService-Info.plist`
6. ✅ Check **"Copy items if needed"**
7. ✅ Check **"Create groups"**
8. ✅ Check **"Add to targets: rockoai"**
9. Click **Add**

### Bước 2.5: Initialize Firebase trong AppDelegate

File `ios/rockoai/AppDelegate.swift` đã được cập nhật để tự động initialize Firebase:

```swift
import FirebaseCore

public override func application(
  _ application: UIApplication,
  didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
) -> Bool {
  // Initialize Firebase
  FirebaseApp.configure()
  // ... rest of code
}
```

Nếu file chưa có, hãy thêm:
1. Import `FirebaseCore` ở đầu file
2. Gọi `FirebaseApp.configure()` trong `didFinishLaunchingWithOptions`

### Bước 3: Verify

1. Mở Xcode project
2. Check `GoogleService-Info.plist` xuất hiện trong project navigator
3. Check file được add vào **Target Membership** → `rockoai`

### Bước 3: Install Pods (nếu cần)

```bash
cd ios && pod install && cd ..
```

### Bước 4: Rebuild

```bash
npx expo run:ios
```

**Lưu ý**: Rebuild sẽ tự động:
- Copy `GoogleService-Info.plist` vào Xcode project
- Link native modules
- Initialize Firebase app

## Cấu trúc File

```
ios/
└── rockoai/
    ├── GoogleService-Info.plist  ← File này
    ├── AppDelegate.swift
    ├── Info.plist
    └── ...
```

## Nội dung GoogleService-Info.plist

File sẽ có dạng:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>API_KEY</key>
    <string>your_api_key</string>
    <key>GCM_SENDER_ID</key>
    <string>your_sender_id</string>
    <key>PLIST_VERSION</key>
    <string>1</string>
    <key>BUNDLE_ID</key>
    <string>com.leejungkiin.rockoai</string>
    <key>PROJECT_ID</key>
    <string>your_project_id</string>
    <key>STORAGE_BUCKET</key>
    <string>your_storage_bucket</string>
    <key>IS_ADS_ENABLED</key>
    <false/>
    <key>IS_ANALYTICS_ENABLED</key>
    <false/>
    <key>IS_APPINVITE_ENABLED</key>
    <true/>
    <key>IS_GCM_ENABLED</key>
    <true/>
    <key>IS_SIGNIN_ENABLED</key>
    <true/>
    <key>GOOGLE_APP_ID</key>
    <string>your_app_id</string>
</dict>
</plist>
```

## Lưu ý

1. **Bundle ID phải match**: `BUNDLE_ID` trong file phải match với `bundleIdentifier` trong `app.json`
2. **Không commit**: Nên add `GoogleService-Info.plist` vào `.gitignore` nếu có sensitive data
3. **Rebuild required**: Sau khi add file, cần rebuild app

## Troubleshooting

### File không được nhận diện

- Check file có trong Xcode project navigator
- Check Target Membership có `rockoai` checked
- Clean build và rebuild: `Product → Clean Build Folder` trong Xcode

### Still getting error

- Verify file format đúng (XML valid)
- Check Bundle ID match
- Restart Xcode
- Rebuild completely

---

**Status**: ⚠️ Cần add GoogleService-Info.plist để React Native Firebase hoạt động

