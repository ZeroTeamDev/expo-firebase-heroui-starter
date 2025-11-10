# Troubleshooting 500 Error

## Quick Steps

### 1. Check Firebase Functions Logs

```bash
# View recent logs
firebase functions:log --limit 50

# View only errors
firebase functions:log | grep -i error | tail -20

# View logs in real-time
firebase functions:log --follow
```

### 2. Check API Key

The most common cause of 500 errors is missing API key:

```bash
# Check if API key is set
firebase functions:secrets:access GEMINI_API_KEY

# If not set, set it:
firebase functions:secrets:set GEMINI_API_KEY
# Then enter your API key when prompted
```

### 3. Check Client Logs

In your React Native app, check the console for detailed error messages:

- Look for `[AI] Chat request failed:` logs
- Check for `requestId` in error messages
- Look for `status`, `statusText`, and `errorData` in logs

### 4. Common Error Scenarios

#### Error: "GEMINI_API_KEY is not set"

**Solution:**
```bash
firebase functions:secrets:set GEMINI_API_KEY
# Enter your Gemini API key
# Redeploy functions
firebase deploy --only functions
```

#### Error: "API key invalid" or "401 Unauthorized"

**Solution:**
1. Verify API key is correct
2. Check API key has proper permissions
3. Regenerate API key if needed

#### Error: "Rate limit exceeded" or "429 Too Many Requests"

**Solution:**
1. Wait a few minutes
2. Check your API quota
3. Implement rate limiting in your app

#### Error: "Internal server error" or "500"

**Solution:**
1. Check Firebase Functions logs for detailed error
2. Verify API key is set correctly
3. Check function deployment status
4. Verify request format matches expected schema

## Debugging Workflow

### Step 1: Get Request ID

When you see a 500 error in your app, look for the `requestId` in the error message or logs.

### Step 2: Search Logs

```bash
# Replace REQ_ID with actual request ID
firebase functions:log | grep "REQ_ID"
```

### Step 3: Analyze Error

Look for:
- Error message
- Stack trace
- API key status
- Request details
- Response details

### Step 4: Check Common Issues

1. **API Key Missing:**
   - Look for: `[Chat] API key missing`
   - Solution: Set API key using `firebase functions:secrets:set GEMINI_API_KEY`

2. **Invalid Request:**
   - Look for: `[aiChat:req_xxx] Missing required field: message`
   - Solution: Verify request format

3. **Gemini API Error:**
   - Look for: `[Chat:chat_xxx] Failed to send message`
   - Solution: Check API key, quota, and request format

4. **Network Error:**
   - Look for: `Request timeout` or connection errors
   - Solution: Check network connectivity, increase timeout

## Example Log Analysis

### Successful Request
```
[aiChat:req_123] Request received: { method: 'POST', ... }
[aiChat:req_123] Processing request: { stream: false, ... }
[ChatNonStreaming:chat_ns_456] Starting: { messageLength: 10, ... }
[Chat] Gemini client initialization: { hasApiKey: true, ... }
[ChatNonStreaming:chat_ns_456] Getting Gemini client
[ChatNonStreaming:chat_ns_456] Sending message to Gemini
[ChatNonStreaming:chat_ns_456] Response received
[ChatNonStreaming:chat_ns_456] Text extracted: { textLength: 100, duration: 1500 }
[aiChat:req_123] Non-streaming response received: { contentLength: 100, duration: 1600 }
```

### Failed Request (API Key Missing)
```
[aiChat:req_123] Request received: { method: 'POST', ... }
[aiChat:req_123] Processing request: { stream: false, ... }
[ChatNonStreaming:chat_ns_456] Starting: { messageLength: 10, ... }
[Chat] Gemini client initialization: { hasApiKey: false, ... }
[Chat] API key missing: { availableEnvVars: [] }
[ChatNonStreaming:chat_ns_456] Error: {
  message: 'GEMINI_API_KEY is not set',
  stack: '...',
  duration: 50
}
[aiChat:req_123] Top-level error: {
  message: 'GEMINI_API_KEY is not set',
  code: undefined,
  duration: 100
}
```

### Failed Request (Invalid API Key)
```
[aiChat:req_123] Request received: { method: 'POST', ... }
[ChatNonStreaming:chat_ns_456] Starting: { messageLength: 10, ... }
[Chat] Gemini client initialization: { hasApiKey: true, ... }
[ChatNonStreaming:chat_ns_456] Sending message to Gemini
[ChatNonStreaming:chat_ns_456] Failed to send message: {
  message: 'API key not valid',
  code: 'INVALID_API_KEY',
  status: 401
}
[aiChat:req_123] Top-level error: {
  message: 'API key not valid',
  code: 'INVALID_API_KEY',
  duration: 500
}
```

## Client-Side Error Messages

When a 500 error occurs, the client will log:

```
[AI] Making chat request: { url: '...', ... }
[AI] Chat response status: 500 Internal Server Error
[AI] Chat request failed: {
  status: 500,
  statusText: 'Internal Server Error',
  errorData: { error: '...', code: '...', requestId: '...' },
  requestId: '...'
}
[AI] Non-streaming chat error: {
  message: '...',
  status: 500,
  response: { ... }
}
[useAIChat] Error in startChat: {
  message: '...',
  status: 500,
  requestId: '...'
}
```

## Getting Help

If you're still experiencing issues:

1. **Collect Information:**
   - Request ID from error message
   - Full error logs from Firebase Functions
   - Client-side error logs
   - Request/response examples

2. **Check Status:**
   - [Firebase Status](https://status.firebase.google.com)
   - [Google Cloud Status](https://status.cloud.google.com)
   - [Gemini API Status](https://status.cloud.google.com)

3. **Verify Setup:**
   - API key is set correctly
   - Functions are deployed
   - Request format is correct
   - Network connectivity is working

---

Created by Kien AI (leejungkiin@gmail.com)

