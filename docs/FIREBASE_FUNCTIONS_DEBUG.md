# Firebase Functions Debug Guide

## Overview

Firebase Functions đã được cấu hình với logging chi tiết để dễ dàng debug các lỗi. Mỗi request sẽ có một unique ID để theo dõi qua các logs.

## Logging Structure

### Request ID Format
- Format: `req_<timestamp>_<random>`
- Example: `req_1703123456789_abc123def`

### Chat ID Format
- Streaming: `chat_<timestamp>_<random>`
- Non-streaming: `chat_ns_<timestamp>_<random>`

## Log Levels

### Info Logs
- Request received
- Processing steps
- Success completion

### Warning Logs
- Invalid requests
- Missing data
- Fallback scenarios

### Error Logs
- API failures
- Validation errors
- Unexpected errors

## Viewing Logs

### Firebase Console
```bash
# View all logs
firebase functions:log

# View logs for specific function
firebase functions:log --only aiChat

# View logs in real-time
firebase functions:log --follow

# View recent logs (last 100 lines)
firebase functions:log --limit 100

# View logs with specific search term
firebase functions:log | grep "error\|Error\|ERROR"
```

### Quick Debug Commands
```bash
# View latest errors only
firebase functions:log | grep -i error | tail -20

# View logs for last 5 minutes
firebase functions:log --since 5m

# View logs with request ID (replace REQ_ID)
firebase functions:log | grep "REQ_ID"
```

### Firebase Console Web
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Functions → Logs
4. Filter by function name or search for request ID

## Common Error Scenarios

### 1. API Key Missing

**Error:**
```
[Chat] API key missing: { availableEnvVars: [...] }
GEMINI_API_KEY is not set
```

**Solution:**
```bash
# Set API key as secret
firebase functions:secrets:set GEMINI_API_KEY

# Or set in .env file for local development
echo "GEMINI_API_KEY=your-api-key" > functions/.env
```

### 2. Invalid Request

**Error:**
```
[aiChat:req_xxx] Missing required field: message
```

**Solution:**
- Ensure request body includes `message` field
- Check request format matches expected schema

### 3. Gemini API Error

**Error:**
```
[Chat:chat_xxx] Failed to send message: {
  message: "...",
  code: "...",
  status: 400
}
```

**Solution:**
- Check API key is valid
- Verify request format matches Gemini API requirements
- Check API quota/limits

### 4. Streaming Error

**Error:**
```
[aiChat:req_xxx] Streaming error: {
  message: "...",
  stack: "..."
}
```

**Solution:**
- Check network connectivity
- Verify streaming is supported on platform
- Check response format

## Debugging Steps

### Step 1: Check Request ID
1. Find request ID in error response or logs
2. Search for all logs with that ID:
   ```bash
   firebase functions:log | grep "req_xxx"
   ```

### Step 2: Trace Request Flow
1. Look for `[aiChat:req_xxx] Request received`
2. Follow logs chronologically
3. Identify where error occurs

### Step 3: Check API Key Status
1. Look for `[Chat] Gemini client initialization`
2. Verify `hasApiKey: true`
3. Check API key prefix matches expected format

### Step 4: Analyze Error Details
1. Check error message
2. Review stack trace
3. Check error code and status
4. Review error details (if available)

## Log Examples

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

### Failed Request
```
[aiChat:req_123] Request received: { method: 'POST', ... }
[aiChat:req_123] Processing request: { stream: false, ... }
[ChatNonStreaming:chat_ns_456] Starting: { messageLength: 10, ... }
[Chat] Gemini client initialization: { hasApiKey: false, ... }
[Chat] API key missing: { availableEnvVars: [...] }
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

## Performance Monitoring

### Key Metrics Logged
- Request duration (ms)
- Chunk count (streaming)
- Content length
- API call duration

### Example Performance Log
```
[aiChat:req_123] Streaming completed: {
  chunkCount: 15,
  hasUsage: true,
  duration: 2500
}
[aiChat:req_123] Response ended, total duration: 2600ms
```

## Best Practices

1. **Always include request ID in error responses** - Makes it easy to trace
2. **Log at key decision points** - Helps understand flow
3. **Include duration metrics** - Helps identify performance issues
4. **Log error details** - Don't just log error message
5. **Use structured logging** - Easier to parse and search

## Troubleshooting Checklist

- [ ] Check API key is set correctly
- [ ] Verify request format matches expected schema
- [ ] Check Firebase Functions logs for detailed errors
- [ ] Verify network connectivity
- [ ] Check API quota/limits
- [ ] Review error stack traces
- [ ] Check request/response timing
- [ ] Verify CORS settings
- [ ] Check function deployment status

## Getting Help

If you encounter issues:

1. **Collect logs:**
   ```bash
   firebase functions:log --only aiChat > logs.txt
   ```

2. **Include in bug report:**
   - Request ID
   - Error message
   - Relevant log snippets
   - Request/response examples

3. **Check Firebase Status:**
   - [Firebase Status Page](https://status.firebase.google.com)
   - [Google Cloud Status](https://status.cloud.google.com)

---

Created by Kien AI (leejungkiin@gmail.com)

