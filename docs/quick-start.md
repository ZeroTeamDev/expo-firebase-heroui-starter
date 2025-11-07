# Quick Start Guide

Created by Kien AI (leejungkiin@gmail.com)

Get started with the Expo AI Starter Kit in 5 minutes.

## Installation

```bash
npm install
```

## Basic Usage

### 1. Database Operations

```typescript
import { useDocument, useCollection, useMutation } from '@/services';

function UserProfile({ userId }: { userId: string }) {
  // Read a document with real-time updates
  const { data, loading, error } = useDocument(`users/${userId}`, {
    subscribe: true,
  });

  // Update document
  const { update } = useMutation(`users/${userId}`);
  
  const handleUpdate = async () => {
    await update({ name: 'New Name' });
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  
  return <Text>{data?.name}</Text>;
}
```

### 2. AI Chat

```typescript
import { useAIChat } from '@/services';

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
        <Text key={msg.id}>{msg.content}</Text>
      ))}
      <TextInput value={input} onChangeText={setInput} />
      <Button onPress={handleSend} title="Send" />
    </View>
  );
}
```

### 3. Analytics

```typescript
import { useScreenTracking, useEventTracking } from '@/services';

function MyScreen() {
  // Auto-track screen view
  useScreenTracking('my_screen');
  
  const { trackEvent } = useEventTracking();
  
  const handleClick = () => {
    trackEvent('button_click', { button_name: 'submit' });
  };
  
  return <Button onPress={handleClick} title="Submit" />;
}
```

## Next Steps

- Read [Database Integration Guide](./database-integration.md)
- Read [AI Integration Guide](./ai-integration.md)
- Read [Analytics Integration Guide](./analytics-integration.md)
- Check out [Examples](../app/modules/examples/)

