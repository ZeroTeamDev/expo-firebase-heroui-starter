# Getting Started

Created by Kien AI (leejungkiin@gmail.com)

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Add your Firebase configuration to the project. The app will use native Firebase modules on iOS/Android.

### 3. Run the App

```bash
npm run dev
```

### 4. Explore Examples

1. Open the app
2. Go to Home tab
3. Click on any example:
   - **Database Examples** - Learn Firestore operations
   - **Analytics Examples** - Learn analytics tracking
   - **AI Examples** - Learn AI services

## Using Services

### Database

```typescript
import { useDocument, useCollection, useMutation } from '@/services';

// Read a document
const { data, loading, error } = useDocument('users/user123', {
  subscribe: true, // Real-time updates
});

// Read a collection
const { data } = useCollection('users', {
  subscribe: true,
  filters: {
    orderBy: [['createdAt', 'desc']],
    limit: 10,
  },
});

// Create/Update/Delete
const { create, update, delete: deleteDoc } = useMutation('users/user123');
await create({ name: 'John', email: 'john@example.com' }, true);
await update({ name: 'Jane' });
await deleteDoc();
```

### AI

```typescript
import { useAIChat, useAIVision } from '@/services';

// Chat
const { sendMessage, messages, isStreaming } = useAIChat();
await sendMessage('Hello!');

// Vision
const { analyze, result } = useAIVision();
await analyze({ imageUrl: 'https://...', prompt: 'Describe this image' });
```

### Analytics

```typescript
import { useScreenTracking, useEventTracking } from '@/services';

// Auto-track screen
useScreenTracking('my_screen');

// Track events
const { trackEvent } = useEventTracking();
trackEvent('button_click', { button_name: 'submit' });
```

## Next Steps

- Read the [Quick Start Guide](./quick-start.md)
- Explore [Database Integration](./database-integration.md)
- Explore [AI Integration](./ai-integration.md)
- Explore [Analytics Integration](./analytics-integration.md)
- Check out the example screens in `app/modules/examples/`

