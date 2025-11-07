# AI Integration Guide

Created by Kien AI (leejungkiin@gmail.com)

## Quick Start

### 1. Import the hooks

```typescript
import { useAIChat, useAIVision, useAISpeech } from '@/services/ai';
```

### 2. Chat with AI

```typescript
function ChatScreen() {
  const { sendMessage, messages, isStreaming } = useAIChat();
  const [input, setInput] = useState('');

  const handleSend = async () => {
    await sendMessage(input);
    setInput('');
  };

  return (
    <View>
      {messages.map((msg) => (
        <Text key={msg.id}>{msg.role}: {msg.content}</Text>
      ))}
      <TextInput value={input} onChangeText={setInput} />
      <Button onPress={handleSend} title="Send" disabled={isStreaming} />
    </View>
  );
}
```

### 3. Analyze Images

```typescript
function VisionScreen() {
  const { analyze, loading, result } = useAIVision();

  const handleAnalyze = async () => {
    await analyze({
      imageUrl: 'https://example.com/image.jpg',
      prompt: 'Describe this image',
    });
  };

  return (
    <View>
      <Button onPress={handleAnalyze} title="Analyze" disabled={loading} />
      {result && <Text>{result.description}</Text>}
    </View>
  );
}
```

## API Reference

### Hooks

#### useAIChat

Chat with AI with conversation management.

```typescript
const {
  messages,
  isStreaming,
  error,
  currentMessage,
  sendMessage,
  startChat,
  clearConversation,
} = useAIChat(conversationId?, options?);
```

**Options:**
- `retryCount?: number` - Number of retries (default: 3)
- `retryDelay?: number` - Delay between retries in ms (default: 1000)
- `timeout?: number` - Request timeout in ms (default: 30000)
- `onError?: (error: Error) => void` - Error callback
- `onSuccess?: (result: any) => void` - Success callback

#### useAIVision

Analyze images with AI.

```typescript
const { analyze, loading, error, result } = useAIVision(options?);
```

#### useAISpeech

Speech-to-text conversion.

```typescript
const { transcribe, loading, error, transcript } = useAISpeech(options?);
```

#### useAITTS

Text-to-speech conversion.

```typescript
const { speak, loading, error, audioUrl } = useAITTS(options?);
```

#### useAIEmbeddings

Generate embeddings and semantic search.

```typescript
const { embed, search, loading, error, embeddings } = useAIEmbeddings(options?);

// Generate embeddings
await embed({ text: 'Hello world' });

// Semantic search
const results = await search(
  'query text',
  [
    { id: '1', text: 'Document 1' },
    { id: '2', text: 'Document 2' },
  ],
  5 // top K results
);
```

## Best Practices

### 1. Error Handling

Always handle errors:

```typescript
const { sendMessage, error } = useAIChat(undefined, {
  onError: (error) => {
    Alert.alert('Error', error.message);
  },
});
```

### 2. Loading States

Show loading indicators:

```typescript
const { isStreaming } = useAIChat();

{isStreaming && <ActivityIndicator />}
```

### 3. Conversation Management

Use conversation IDs for context:

```typescript
const conversationId = 'conv_123';
const { sendMessage, messages } = useAIChat(conversationId);

// Messages are automatically stored and retrieved
```

### 4. Rate Limiting

Handle rate limits gracefully:

```typescript
const { sendMessage } = useAIChat(undefined, {
  onError: (error) => {
    if (error.message.includes('rate limit')) {
      // Show rate limit message
      Alert.alert('Rate Limit', 'Please wait before sending another message');
    }
  },
});
```

### 5. Token Usage

Monitor token usage:

```typescript
const { messages } = useAIChat();
const totalTokens = messages.reduce((sum, msg) => {
  return sum + (msg.usage?.totalTokens || 0);
}, 0);
```

## Examples

See `app/modules/examples/ai-example/index.tsx` for complete examples.
