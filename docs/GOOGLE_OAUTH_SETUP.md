# Google OAuth Setup Guide

## Tổng quan

Google Client IDs **KHÔNG** có trong Firebase config. Bạn cần tạo OAuth 2.0 credentials từ **Google Cloud Console**.

## Cách lấy Google Client IDs

### Bước 1: Truy cập Google Cloud Console

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project `demosdk-1756a` (hoặc project Firebase của bạn)
3. Vào **APIs & Services** > **Credentials**

### Bước 2: Tạo OAuth 2.0 Client IDs

1. Click **Create Credentials** > **OAuth client ID**
2. Nếu chưa có OAuth consent screen, bạn sẽ được yêu cầu cấu hình:

   - Chọn **External** (hoặc Internal nếu dùng Google Workspace)
   - Điền thông tin app (App name, User support email, Developer contact)
   - Save and Continue

3. Tạo OAuth Client IDs cho từng platform:

#### a) iOS Client ID

- Application type: **iOS**
- Name: `Expo App iOS`
- Bundle ID: Lấy từ `app.json` hoặc `app.config.js` (ví dụ: `com.leejungkiin.rockoai`)
- Click **Create**
- Copy **Client ID** (dạng: `xxxxx.apps.googleusercontent.com`)

#### b) Android Client ID

- Application type: **Android**
- Name: `Expo App Android`
- Package name: Lấy từ `app.json` (ví dụ: `com.leejungkiin.rockoai`)
- SHA-1 certificate fingerprint:
  - Development: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
  - Production: Lấy từ keystore của bạn
- Click **Create**
- Copy **Client ID**

#### c) Web Client ID (cho Expo Go)

- Application type: **Web application**
- Name: `Expo App Web`
- Authorized redirect URIs:
  - `https://auth.expo.io/@your-expo-username/your-app-slug`
  - Hoặc `exp://localhost:8081` (cho development)
- Click **Create**
- Copy **Client ID**

### Bước 3: Thêm vào .env

Thêm các Client IDs vào file `.env`:

```env
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxxxx-ios.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxxxx-android.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=xxxxx-web.apps.googleusercontent.com
```

### Bước 4: Enable Google Sign-In trong Firebase

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project `demosdk-1756a`
3. Vào **Authentication** > **Sign-in method**
4. Enable **Google** sign-in provider
5. Đảm bảo **Project support email** đã được set

### Bước 5: Restart app

```bash
npx expo start -c
```

## Lưu ý

- **Google Client IDs khác với Firebase config**: Firebase config chỉ dùng cho Firebase services, không dùng cho OAuth
- **Không bắt buộc**: Nếu chưa cần Google Sign-In, bạn có thể bỏ qua. App vẫn hoạt động với Email/Password login
- **Development vs Production**:
  - Development: Có thể dùng Web Client ID cho Expo Go
  - Production: Cần đầy đủ iOS, Android, và Web Client IDs

## Troubleshooting

### Lỗi: "Client Id property 'iosClientId' must be defined"

- **Nguyên nhân**: Chưa có `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` trong `.env`
- **Giải pháp**: Thêm Client ID hoặc tạm thời comment code Google Sign-In

### Lỗi: "redirect_uri_mismatch"

- **Nguyên nhân**: Redirect URI không khớp với cấu hình trong Google Cloud Console
- **Giải pháp**: Kiểm tra Authorized redirect URIs trong OAuth Client ID settings

### Google Sign-In button không hiển thị

- **Nguyên nhân**: Chưa có Google Client IDs trong `.env`
- **Giải pháp**: Đây là hành vi bình thường. Button chỉ hiển thị khi đã cấu hình đầy đủ

## Tài liệu tham khảo

- [Expo AuthSession - Google](https://docs.expo.dev/guides/authentication/#google)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Authentication - Google](https://firebase.google.com/docs/auth/web/google-signin)
