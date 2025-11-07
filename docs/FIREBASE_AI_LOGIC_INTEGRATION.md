# Firebase AI Logic Integration - Không Cần API Key

## Tổng Quan

Theo [tài liệu chính thức của Firebase](https://firebase.google.com/docs/ai-logic/get-started?hl=vi&api=dev#prereqs), **Firebase AI Logic SDK tự động quản lý API key** và bạn không cần quản lý thủ công.

## Cách Hoạt Động

### Client-Side (Web, iOS, Android, Flutter)

Firebase AI Logic SDK tự động:
1. **Tạo API key tự động** khi setup trong Firebase Console
2. **Quản lý API key ở backend** (proxy service)
3. **Bảo mật API key** - không expose trong client code
4. **SDK tự động inject API key** vào mỗi request qua proxy

**Ví dụ (Web):**
```javascript
import { getAI } from 'firebase/ai';

const ai = getAI();
const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
const response = await model.generateContent('Hello!');
console.log(response.text);
```

**Ví dụ (React Native/Expo):**
```typescript
import { getAI } from '@firebase/ai';

const ai = getAI();
const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
const response = await model.generateContent('Hello!');
console.log(response.text);
```

### Server-Side (Firebase Functions)

⚠️ **Firebase AI Logic SDK hiện tại chủ yếu dành cho client-side**. 

Tuy nhiên, có **3 giải pháp** cho server-side:

#### Option 1: Sử dụng Vertex AI SDK với Application Default Credentials (Recommended)

**Vertex AI SDK** sử dụng **Application Default Credentials (ADC)** mà Firebase Functions tự động cung cấp - **không cần API key**.

**Setup:**

1. **Enable Vertex AI API:**
```bash
gcloud services enable aiplatform.googleapis.com
```

2. **Install Vertex AI SDK:**
```bash
cd functions
npm install @google-cloud/vertexai
```

3. **Update code để sử dụng Vertex AI:**
```typescript
import { VertexAI } from '@google-cloud/vertexai';

// Vertex AI tự động sử dụng Application Default Credentials
const vertexAI = new VertexAI({
  project: 'your-project-id',
  location: 'us-central1',
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

const response = await model.generateContent('Hello!');
console.log(response.response.text());
```

**Lợi ích:**
- ✅ **Không cần API key** - Sử dụng ADC tự động
- ✅ **Secure** - Credentials được quản lý tự động bởi Google Cloud
- ✅ **Production-ready** - Được recommend bởi Google
- ✅ **Tích hợp tốt với Firebase Functions**

#### Option 2: Sử dụng Firebase Secrets Manager (Fallback)

Nếu bạn muốn sử dụng Gemini API trực tiếp (không qua Vertex AI):

```bash
# Set secret một lần
firebase functions:secrets:set GEMINI_API_KEY
```

**Lợi ích:**
- ✅ Secure - API key được mã hóa
- ✅ Đơn giản - Chỉ cần set một lần
- ✅ Tự động rotate - Có thể cấu hình

#### Option 3: Client-Side Only với Firebase AI Logic SDK

Nếu bạn chỉ cần AI ở client-side, sử dụng Firebase AI Logic SDK trực tiếp:

```typescript
// Client-side code
import { getAI } from 'firebase/ai';

const ai = getAI();
const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
const response = await model.generateContent('Hello!');
```

**Không cần Firebase Functions** - AI chạy trực tiếp từ client qua Firebase proxy.

## Setup Firebase AI Logic trong Firebase Console

1. **Mở Firebase Console**: [console.firebase.google.com](https://console.firebase.google.com)
2. **Chọn project của bạn**
3. **Vào Build → AI Logic** (hoặc **Extensions → Firebase AI Logic**)
4. **Enable Firebase AI Logic**
5. **Firebase tự động tạo API key** và quản lý ở backend

## Migration Path

### Hiện Tại (Sử dụng @google/generative-ai với API key)

```typescript
// functions/src/ai/chat.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(apiKey); // ❌ Cần API key
```

### Tương Lai (Sử dụng Vertex AI với ADC)

```typescript
// functions/src/ai/chat.ts
import { VertexAI } from '@google-cloud/vertexai';

const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT || 'your-project-id',
  location: 'us-central1',
}); // ✅ Không cần API key - tự động dùng ADC

const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});
```

## Recommendation

### Cho Client-Side Apps:
✅ **Sử dụng Firebase AI Logic SDK** - Tự động quản lý API key, không cần setup gì

### Cho Server-Side (Firebase Functions):
✅ **Sử dụng Vertex AI SDK với ADC** - Không cần API key, tự động authenticate

### Hybrid Approach:
- **Client-side**: Firebase AI Logic SDK
- **Server-side**: Vertex AI SDK với ADC
- **Kết quả**: Không cần quản lý API key ở đâu cả!

## Next Steps

1. **Enable Vertex AI API** trong Google Cloud Console
2. **Install Vertex AI SDK**: `npm install @google-cloud/vertexai`
3. **Update Firebase Functions code** để sử dụng Vertex AI SDK
4. **Remove API key management code** (secrets, env vars)
5. **Deploy và test**

## References

- [Firebase AI Logic Documentation](https://firebase.google.com/docs/ai-logic/get-started?hl=vi&api=dev#prereqs)
- [Vertex AI Node.js SDK](https://cloud.google.com/vertex-ai/docs/start/use-sdk-nodejs)
- [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials)

---

Created by Kien AI (leejungkiin@gmail.com)

