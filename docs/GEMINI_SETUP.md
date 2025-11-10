# Gemini API Setup Guide

## Prerequisites

1. Get Gemini API Key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set up Firebase Functions environment variables

## Setup Steps

### 1. Set Secret in Firebase Functions (v2)

Firebase Functions v2 sử dụng **Secrets Manager** để quản lý API keys.

#### Using Firebase CLI (Recommended)

```bash
# Set the GEMINI_API_KEY secret
firebase functions:secrets:set GEMINI_API_KEY
# When prompted, paste your API key

# Deploy functions (this will make the secret available to functions)
firebase deploy --only functions
```

**Important**: Secret phải được set **trước khi deploy**. Functions sẽ tự động có quyền truy cập secret sau khi deploy.

### 2. Local Development (.env file)

For local testing with Firebase emulator, create a `.env` file in the `functions` directory:

```bash
cd functions
echo "GEMINI_API_KEY=YOUR_GEMINI_API_KEY" > .env
```

**Note**: The `.env` file is for local development only. For production, use Firebase Functions environment variables.

### 3. Verify Setup

After deploying, test the functions:

```bash
# Test chat function
curl -X POST https://us-central1-demosdk-1756a.cloudfunctions.net/aiChat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?", "stream": false}'
```

## Available Models

- `gemini-pro` - Default model for text generation
- `gemini-pro-vision` - For vision/image analysis tasks

## Usage Examples

### Chat (Streaming)

```typescript
const response = await fetch('https://us-central1-demosdk-1756a.cloudfunctions.net/aiChat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello!',
    stream: true,
    model: 'gemini-pro',
  }),
});

const reader = response.body?.getReader();
// Read streaming chunks...
```

### Chat (Non-streaming)

```typescript
const response = await fetch('https://us-central1-demosdk-1756a.cloudfunctions.net/aiChat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello!',
    stream: false,
    model: 'gemini-pro',
  }),
});

const data = await response.json();
console.log(data.content);
```

### Vision Analysis

```typescript
const response = await fetch('https://us-central1-demosdk-1756a.cloudfunctions.net/aiVision', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageUrl: 'https://example.com/image.jpg',
    prompt: 'Describe this image in detail',
  }),
});

const data = await response.json();
console.log(data.summary);
```

## Troubleshooting

### Error: GEMINI_API_KEY is not set

1. Verify the environment variable is set:
```bash
firebase functions:config:get
```

2. Redeploy functions after setting the variable:
```bash
firebase deploy --only functions
```

### Error: Invalid API Key

1. Verify your API key is correct
2. Check that the API key has the necessary permissions
3. Ensure you're using the correct project in Firebase Console

### CORS Errors

Functions are configured with CORS enabled. If you still see CORS errors:
1. Check that `cors: true` is set in function configuration
2. Verify Access-Control headers are set in function responses
3. Ensure OPTIONS requests are handled correctly

## Security Notes

- Never commit API keys to version control
- Use Firebase Functions environment variables for production
- Rotate API keys regularly
- Monitor API usage in Google AI Studio

