# Firebase Functions - Không Cần Quản Lý API Key

## Vấn Đề

Firebase Functions **không tự động inject API key** từ Google AI Studio như Firebase App Hosting. Cần một cách khác để tránh quản lý API key thủ công.

## Giải Pháp

### Option 1: Sử dụng Firebase Secrets Manager (Recommended)

Firebase Secrets Manager tự động quản lý API key, bạn chỉ cần set một lần:

```bash
# Set secret (chỉ cần làm một lần)
firebase functions:secrets:set GEMINI_API_KEY

# Deploy functions
firebase deploy --only functions
```

**Lợi ích:**
- ✅ Secure - API key được mã hóa và quản lý bởi Google Cloud
- ✅ Tự động rotate - Có thể cấu hình tự động rotate
- ✅ Audit trail - Theo dõi ai đã truy cập secret
- ✅ Không cần hardcode trong code

### Option 2: Sử dụng Vertex AI với Application Default Credentials

Vertex AI sử dụng Application Default Credentials (ADC) mà Firebase Functions tự động cung cấp - **không cần API key**.

**Setup:**

1. Enable Vertex AI API:
```bash
gcloud services enable aiplatform.googleapis.com
```

2. Update code để sử dụng Vertex AI thay vì Gemini API trực tiếp

**Lợi ích:**
- ✅ Không cần API key
- ✅ Tự động authenticate với ADC
- ✅ Secure - Credentials được quản lý tự động

**Nhược điểm:**
- ⚠️ Cần enable Vertex AI API
- ⚠️ Cần update code để sử dụng Vertex AI SDK

### Option 3: Kết Hợp App Hosting + Functions

Nếu bạn muốn sử dụng automatic injection như dự án cũ:

1. **Deploy frontend lên App Hosting** (sẽ có automatic injection)
2. **Call Functions từ frontend** với API key đã được inject
3. **Functions nhận API key từ request** thay vì từ environment

**Lợi ích:**
- ✅ Tương tự dự án cũ
- ✅ Automatic injection từ Google AI Studio

**Nhược điểm:**
- ⚠️ Cần deploy cả App Hosting
- ⚠️ API key được expose từ client (cần security measures)

## Recommendation

**Cho Firebase Functions, nên sử dụng Option 1 (Secrets Manager)** vì:
- Đơn giản nhất
- Secure nhất
- Không cần thay đổi architecture
- Chỉ cần set một lần

## Quick Start

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or copy your API key

### Step 2: Set Secret

```bash
firebase functions:secrets:set GEMINI_API_KEY
# Paste your API key when prompted
```

### Step 3: Deploy

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

**Done!** Functions sẽ tự động sử dụng secret này.

## Verification

After deployment, check logs:

```bash
firebase functions:log | grep "Gemini client initialization"
```

Should see:
```
[Chat] Gemini client initialization: {
  hasApiKey: true,
  apiKeyLength: 39,
  source: 'secret'
}
```

## Migration from Manual Management

Nếu bạn đang sử dụng manual API key management:

1. **Set secret:**
   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   ```

2. **Remove hardcoded keys** from code

3. **Redeploy:**
   ```bash
   firebase deploy --only functions
   ```

Code sẽ tự động sử dụng secret.

## Security Best Practices

1. ✅ **Use Secrets Manager** - Never hardcode API keys
2. ✅ **Rotate keys regularly** - Set up automatic rotation if possible
3. ✅ **Limit access** - Only give access to necessary services
4. ✅ **Monitor usage** - Check logs regularly for suspicious activity
5. ✅ **Use IAM** - Properly configure service account permissions

## Troubleshooting

### Secret Not Working

```bash
# Check if secret is set
firebase functions:secrets:access GEMINI_API_KEY

# List all secrets
firebase functions:secrets:list

# Redeploy after setting secret
firebase deploy --only functions
```

### Still Getting "API key missing"

1. Verify secret is set: `firebase functions:secrets:list`
2. Check function has access to secret in `functions/src/index.ts`
3. Check logs for detailed error: `firebase functions:log | grep "API key"`

---

Created by Kien AI (leejungkiin@gmail.com)

