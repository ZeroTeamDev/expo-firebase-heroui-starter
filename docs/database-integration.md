# Database Integration Guide

Created by Kien AI (leejungkiin@gmail.com)

## Quick Start (5 minutes)

### 1. Import the hooks

```typescript
import { useDocument, useCollection, useMutation } from '@/hooks/use-firestore';
```

### 2. Read a document

```typescript
function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useDocument<User>(`users/${userId}`, {
    subscribe: true, // Enable real-time updates
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!data) return <Text>User not found</Text>;

  return <Text>{data.name}</Text>;
}
```

### 3. Read a collection

```typescript
function UsersList() {
  const { data, loading, error } = useCollection<User>('users', {
    subscribe: true,
    filters: {
      orderBy: [['createdAt', 'desc']],
      limit: 10,
    },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {data.map((user) => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
}
```

### 4. Create/Update/Delete

```typescript
function UserForm({ userId }: { userId: string }) {
  const { create, update, delete: deleteUser, loading } = useMutation<User>(
    `users/${userId}`,
    {
      onSuccess: () => {
        Alert.alert('Success', 'Operation completed');
      },
      onError: (error) => {
        Alert.alert('Error', error.message);
      },
    }
  );

  const handleCreate = async () => {
    await create({ name: 'John', email: 'john@example.com' }, true); // true = auto-generate ID
  };

  const handleUpdate = async () => {
    await update({ name: 'Jane' });
  };

  const handleDelete = async () => {
    await deleteUser();
  };

  return (
    <View>
      <Button onPress={handleCreate} title="Create" />
      <Button onPress={handleUpdate} title="Update" />
      <Button onPress={handleDelete} title="Delete" />
    </View>
  );
}
```

## API Reference

### useDocument

Read and subscribe to a single document.

```typescript
const { data, loading, error } = useDocument<T>(
  path: string | null,
  options?: UseDocumentOptions
);
```

**Options:**
- `subscribe?: boolean` - Enable real-time updates (default: false)
- `enabled?: boolean` - Enable/disable the hook (default: true)
- `retryCount?: number` - Number of retries on error (default: 3)
- `retryDelay?: number` - Delay between retries in ms (default: 1000)

### useCollection

Read and subscribe to a collection.

```typescript
const { data, loading, error } = useCollection<T>(
  path: string | null,
  options?: UseCollectionOptions
);
```

**Options:**
- `subscribe?: boolean` - Enable real-time updates (default: false)
- `enabled?: boolean` - Enable/disable the hook (default: true)
- `filters?: QueryFilters` - Query filters (where, orderBy, limit, etc.)
- `retryCount?: number` - Number of retries on error (default: 3)
- `retryDelay?: number` - Delay between retries in ms (default: 1000)

### useMutation

Create, update, or delete documents.

```typescript
const { create, update, delete, loading, error } = useMutation<T>(
  path: string | null,
  options?: UseMutationOptions
);
```

**Methods:**
- `create(data: T, useAutoId?: boolean): Promise<string | null>` - Create a document
- `update(data: Partial<T>): Promise<boolean>` - Update a document
- `delete(): Promise<boolean>` - Delete a document

**Options:**
- `onSuccess?: (result: any) => void` - Success callback
- `onError?: (error: Error) => void` - Error callback
- `optimisticUpdate?: boolean` - Enable optimistic updates (default: false)
- `retryCount?: number` - Number of retries on error (default: 3)
- `retryDelay?: number` - Delay between retries in ms (default: 1000)

### useBatch

Execute batch operations.

```typescript
const { execute, loading, error } = useBatch();

await execute((batch) => {
  batch.set('users/user1', { name: 'John' });
  batch.update('users/user2', { name: 'Jane' });
  batch.delete('users/user3');
});
```

### useTransaction

Execute transactions.

```typescript
const { execute, loading, error } = useTransaction();

await execute(async (transaction) => {
  // Transaction logic
  const userRef = getDocumentRef('users/user1');
  const userDoc = await transaction.get(userRef);
  if (userDoc.exists()) {
    transaction.update(userRef, { count: userDoc.data().count + 1 });
  }
});
```

## Query Filters

```typescript
const filters: QueryFilters = {
  where: [
    ['age', '>=', 18],
    ['status', '==', 'active'],
  ],
  orderBy: [
    ['createdAt', 'desc'],
    ['name', 'asc'],
  ],
  limit: 10,
  startAfter: lastDocument, // For pagination
};
```

## Best Practices

### 1. Use TypeScript types

```typescript
interface User {
  id?: string;
  name: string;
  email: string;
  age: number;
}

const { data } = useDocument<User>('users/user123');
```

### 2. Enable real-time updates only when needed

```typescript
// Good: Real-time for active data
const { data } = useDocument('users/current', { subscribe: true });

// Good: One-time read for static data
const { data } = useDocument('settings/app', { subscribe: false });
```

### 3. Handle loading and error states

```typescript
const { data, loading, error } = useDocument('users/user123');

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <UserProfile user={data} />;
```

### 4. Use filters for efficient queries

```typescript
// Good: Filter on server
const { data } = useCollection('users', {
  filters: {
    where: [['status', '==', 'active']],
    orderBy: [['createdAt', 'desc']],
    limit: 10,
  },
});

// Bad: Filter on client
const { data } = useCollection('users');
const activeUsers = data.filter((u) => u.status === 'active');
```

### 5. Use batch operations for multiple writes

```typescript
// Good: Batch operation
await executeBatch((batch) => {
  batch.set('users/user1', data1);
  batch.set('users/user2', data2);
  batch.set('users/user3', data3);
});

// Bad: Multiple individual writes
await create('users/user1', data1);
await create('users/user2', data2);
await create('users/user3', data3);
```

## Common Patterns

### Pagination

```typescript
function UsersList() {
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const { data, loading } = useCollection<User>('users', {
    filters: {
      orderBy: [['createdAt', 'desc']],
      limit: 10,
      startAfter: lastDoc || undefined,
    },
  });

  const loadMore = () => {
    if (data.length > 0) {
      setLastDoc(data[data.length - 1]);
    }
  };

  return (
    <View>
      {data.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
      <Button onPress={loadMore} title="Load More" />
    </View>
  );
}
```

### Optimistic Updates

```typescript
const { update, loading } = useMutation('users/user123', {
  optimisticUpdate: true,
  onSuccess: () => {
    // Update local state immediately
    setLocalData((prev) => ({ ...prev, name: 'New Name' }));
  },
});
```

### Error Handling

```typescript
const { data, error } = useDocument('users/user123', {
  retryCount: 5,
  retryDelay: 2000,
});

useEffect(() => {
  if (error) {
    // Log error, show notification, etc.
    console.error('Database error:', error);
    Alert.alert('Error', 'Failed to load user data');
  }
}, [error]);
```

## Error Handling Guide

### Common Errors

1. **Permission Denied**: Check Firestore security rules
2. **Document Not Found**: Handle null data gracefully
3. **Network Error**: Automatic retry with exponential backoff
4. **Quota Exceeded**: Monitor usage and implement rate limiting

### Retry Strategy

The service automatically retries failed operations with exponential backoff:
- Retry count: 3 (configurable)
- Initial delay: 1000ms (configurable)
- Exponential backoff: delay * 2^attempt

## Examples

See `app/modules/examples/database-example/index.tsx` for complete examples.

