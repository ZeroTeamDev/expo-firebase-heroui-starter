# Set Gemini API Key for Firebase Functions

## Problem

Lỗi 500 xảy ra vì `GEMINI_API_KEY` chưa được set trong Firebase Functions.

Từ logs:
```
[Chat] Gemini client initialization: {
  hasApiKey: false,
  apiKeyLength: 0,
  apiKeyPrefix: 'none',
  envVars: { GEMINI_API_KEY: false, GOOGLE_API_KEY: false, API_KEY: false }
}
[Chat] API key missing: { availableEnvVars: [] }
```

## Solution

Firebase Functions v2 sử dụng **Secrets Manager** để quản lý API keys. Bạn cần set secret trước khi deploy.

## Steps

### 1. Get Gemini API Key

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo hoặc copy API key của bạn

### 2. Set Secret trong Firebase

```bash
# Set secret
firebase functions:secrets:set GEMINI_API_KEY

# Khi được hỏi, paste API key của bạn
# Enter a value for GEMINI_API_KEY: [paste your API key here]
```

### 3. Deploy Functions

```bash
# Build functions
cd functions
npm run build
cd ..

# Deploy functions
firebase deploy --only functions
```

### 4. Verify

Sau khi deploy, test lại. Logs sẽ hiển thị:

```
[Chat] Gemini client initialization: {
  hasApiKey: true,
  apiKeyLength: 39,
  apiKeyPrefix: 'AIza...',
  envVars: { GEMINI_API_KEY: true, GOOGLE_API_KEY: false, API_KEY: false }
}
```

## Alternative: Local Development

Để test locally với Firebase emulator:

### Option 1: Use .env file

```bash
cd functions
echo "GEMINI_API_KEY=your-api-key-here" > .env
```

### Option 2: Set environment variable

```bash
export GEMINI_API_KEY=your-api-key-here
cd functions
npm run serve
```

## Troubleshooting

### Secret không được nhận

1. **Kiểm tra secret đã được set:**
   ```bash
   firebase functions:secrets:access GEMINI_API_KEY
   ```

2. **Kiểm tra function có reference secret:**
   - Xem `functions/src/index.ts`
   - Đảm bảo `secrets: [geminiApiKey]` được set trong function config

3. **Redeploy functions:**
   ```bash
   firebase deploy --only functions
   ```

### Secret bị lỗi format

- Đảm bảo API key không có spaces hoặc newlines
- Copy API key trực tiếp từ Google AI Studio
- Không thêm quotes khi set secret

### Vẫn báo lỗi sau khi set secret

1. **Kiểm tra logs:**
   ```bash
   firebase functions:log | grep "API key"
   ```

2. **Verify secret trong function:**
   - Logs sẽ hiển thị `hasApiKey: true` nếu secret được nhận đúng

3. **Check function deployment:**
   ```bash
   firebase functions:list
   ```

## Security Notes

- ✅ **DO**: Sử dụng Firebase Secrets Manager cho production
- ✅ **DO**: Rotate API keys định kỳ
- ❌ **DON'T**: Commit API keys vào git
- ❌ **DON'T**: Hardcode API keys trong code
- ❌ **DON'T**: Share API keys publicly

## Quick Reference

```bash
# Set secret
firebase functions:secrets:set GEMINI_API_KEY

# View secret (will show masked value)
firebase functions:secrets:access GEMINI_API_KEY

# List all secrets
firebase functions:secrets:list

# Delete secret (if needed)
firebase functions:secrets:delete GEMINI_API_KEY

# Deploy functions
firebase deploy --only functions
```

---

Created by Kien AI (leejungkiin@gmail.com)

