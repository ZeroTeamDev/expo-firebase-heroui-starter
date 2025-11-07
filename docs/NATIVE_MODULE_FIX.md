# Fix Native Module Error: Cannot find native module 'ExponentImagePicker'

## Vấn đề

Khi chạy app, bạn gặp lỗi:
```
Error: Cannot find native module 'ExponentImagePicker'
```

## Nguyên nhân

Native modules như `expo-image-picker` và `expo-document-picker` cần được build vào app native. Lỗi này xảy ra khi:
- App chưa được rebuild sau khi cài đặt native modules
- Native modules chưa được link vào iOS/Android project

## Giải pháp nhanh

### Option 1: Sử dụng script rebuild (Khuyên dùng)

```bash
npm run rebuild:native
```

Script này sẽ:
1. Clean và prebuild native code
2. Install iOS pods
3. Hướng dẫn next steps

Sau đó chạy:
```bash
npx expo run:ios
# hoặc
npx expo run:android
```

### Option 2: Rebuild thủ công

```bash
# 1. Clean và prebuild
npx expo prebuild --clean

# 2. Install iOS pods (nếu build iOS)
cd ios && pod install && cd ..

# 3. Run app
npx expo run:ios
# hoặc
npx expo run:android
```

## Code đã được fix

Code trong `app/modules/examples/ai-example/index.tsx` đã được cập nhật để:
- ✅ **Không crash** khi native modules chưa được link
- ✅ **Gracefully handle** lỗi và hiển thị thông báo hữu ích
- ✅ **Cache module** để tránh require nhiều lần
- ✅ **Suppress error logs** để tránh console spam

## Sau khi rebuild

Sau khi rebuild app, bạn sẽ thấy:
- ✅ `expo-image-picker` hoạt động bình thường
- ✅ `expo-document-picker` hoạt động bình thường
- ✅ Các nút "Pick Image", "Pick Document" sẽ enable
- ✅ Không còn lỗi trong console

## Lưu ý

- **Expo Go không hỗ trợ**: Bạn **phải** sử dụng development build (`npx expo run:ios`) hoặc production build
- **Web không hỗ trợ**: File picker chỉ hoạt động trên iOS và Android
- **Permissions**: App sẽ tự động yêu cầu permissions khi sử dụng file picker lần đầu

## Troubleshooting

### Vẫn gặp lỗi sau khi rebuild

1. **Clear cache**:
   ```bash
   npx expo start --clear
   ```

2. **Clean build folders**:
   ```bash
   # iOS
   rm -rf ios/build
   cd ios && pod deintegrate && pod install && cd ..
   
   # Android
   cd android && ./gradlew clean && cd ..
   ```

3. **Rebuild từ đầu**:
   ```bash
   rm -rf ios android
   npx expo prebuild --clean
   npx expo run:ios
   ```

### Lỗi về GoogleService-Info.plist

Nếu gặp lỗi về `GoogleService-Info.plist`:
- Đảm bảo file tồn tại trong `ios/GoogleService-Info.plist`
- Hoặc tạm thời comment plugin `@react-native-firebase/app` trong `app.json` nếu không sử dụng

## Tạm thời (Trước khi rebuild)

Code đã được cập nhật để **gracefully handle** khi native modules không có:
- ✅ App không crash
- ✅ File picker buttons bị disable với message rõ ràng
- ✅ Bạn vẫn có thể sử dụng URL input để test các tính năng analysis
- ✅ Không có error spam trong console

Sau khi rebuild app, tất cả các tính năng file picker sẽ hoạt động đầy đủ.

