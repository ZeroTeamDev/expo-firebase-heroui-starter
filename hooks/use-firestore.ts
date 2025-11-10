/**
 * Firestore Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * React hooks for Firestore operations with auto error handling and loading states
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  readDocument,
  readCollection,
  createDocument,
  createDocumentWithId,
  updateDocument,
  deleteDocument,
  subscribeToDocument,
  subscribeToCollection,
  createBatch,
  runDatabaseTransaction,
  type DatabaseOptions,
  type QueryFilters,
} from '@/services/firebase/database';
import type { DocumentData } from 'firebase/firestore';

/**
 * Options for useDocument hook
 */
export interface UseDocumentOptions extends DatabaseOptions {
  subscribe?: boolean; // Enable real-time updates
  enabled?: boolean; // Enable/disable the hook
}

/**
 * Hook to read and subscribe to a single document
 */
export function useDocument<T = DocumentData>(
  path: string | null,
  options?: UseDocumentOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const enabled = options?.enabled !== false;
  const subscribe = options?.subscribe ?? false;

  useEffect(() => {
    if (!path || !enabled) {
      setLoading(false);
      return;
    }

    // Cleanup previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setLoading(true);
    setError(null);

    if (subscribe) {
      // Real-time subscription
      unsubscribeRef.current = subscribeToDocument<T>(
        path,
        (docData, err) => {
          setLoading(false);
          if (err) {
            // Handle Firestore not initialized error silently (no console log)
            // Error will be shown in UI through warning banner if needed
            if (err.name !== 'FirestoreNotInitializedError') {
              setError(err);
            } else {
              // Set a user-friendly error message for Firestore not initialized
              // Don't log to console - error is expected when Firebase not configured
              setError(new Error('Database is not available. Please configure Firebase in your native code.'));
            }
            setData(null);
          } else {
            setData(docData);
            setError(null);
          }
        }
      );
    } else {
      // One-time read
      readDocument<T>(path, options)
        .then((docData) => {
          setData(docData);
          setError(null);
        })
        .catch((err) => {
          // Handle Firestore not initialized error silently (no console log)
          const error = err as Error;
          if (error.name !== 'FirestoreNotInitializedError') {
            setError(error);
          } else {
            // Set a user-friendly error message for Firestore not initialized
            // Don't log to console - error is expected when Firebase not configured
            setError(new Error('Database is not available. Please configure Firebase in your native code.'));
          }
          setData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [path, subscribe, enabled, JSON.stringify(options)]);

  return { data, loading, error };
}

/**
 * Options for useCollection hook
 */
export interface UseCollectionOptions extends DatabaseOptions {
  subscribe?: boolean; // Enable real-time updates
  enabled?: boolean; // Enable/disable the hook
  filters?: QueryFilters;
}

/**
 * Hook to read and subscribe to a collection
 */
export function useCollection<T = DocumentData>(
  path: string | null,
  options?: UseCollectionOptions
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const enabled = options?.enabled !== false;
  const subscribe = options?.subscribe ?? false;
  const filters = options?.filters;

  useEffect(() => {
    if (!path || !enabled) {
      setLoading(false);
      return;
    }

    // Cleanup previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setLoading(true);
    setError(null);

    if (subscribe) {
      // Real-time subscription
      unsubscribeRef.current = subscribeToCollection<T>(
        path,
        (collectionData, err) => {
          setLoading(false);
          if (err) {
            // Handle Firestore not initialized error silently (no console log)
            if (err.name !== 'FirestoreNotInitializedError' && err.message !== 'Failed to build query') {
              setError(err);
            } else if (err.name === 'FirestoreNotInitializedError') {
              // Set a user-friendly error message for Firestore not initialized
              // Don't log to console - error is expected when Firebase not configured
              setError(new Error('Database is not available. Please configure Firebase in your native code.'));
            }
            setData([]);
          } else {
            setData(collectionData);
            setError(null);
          }
        },
        filters
      );
    } else {
      // One-time read
      readCollection<T>(path, filters, options)
        .then((collectionData) => {
          setData(collectionData);
          setError(null);
        })
        .catch((err) => {
          // Only set error if it's not a "not initialized" error
          const error = err as Error;
          if (error.name !== 'FirestoreNotInitializedError') {
            setError(error);
          } else {
            // Set a user-friendly error message for Firestore not initialized
            setError(new Error('Database is not available. Please configure Firebase in your native code.'));
          }
          setData([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [path, subscribe, enabled, JSON.stringify(filters), JSON.stringify(options)]);

  return { data, loading, error };
}

/**
 * Options for useMutation hook
 */
export interface UseMutationOptions extends DatabaseOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  optimisticUpdate?: boolean;
}

/**
 * Hook for create/update/delete operations
 */
export function useMutation<T = DocumentData>(
  path: string | null,
  options?: UseMutationOptions
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (data: T, useAutoId = false): Promise<string | null> => {
      if (!path) {
        const err = new Error('Path is required for mutation');
        setError(err);
        options?.onError?.(err);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        let result: string;
        if (useAutoId) {
          // For createDocumentWithId, we need collection path, not document path
          // Extract collection path from document path if needed
          // e.g., "users/user123" -> "users", "users" -> "users"
          const pathParts = path.split('/').filter(Boolean);
          // If path has even number of segments (document path), extract collection
          // If path has odd number of segments (collection path), use as-is
          const collectionPath = pathParts.length % 2 === 0 
            ? pathParts.slice(0, -1).join('/')
            : pathParts.join('/');
          result = await createDocumentWithId<T>(collectionPath, data, options);
        } else {
          // For createDocument, use the path as-is (document path)
          result = await createDocument<T>(path, data, options);
        }
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err as Error;
        // Provide user-friendly error messages
        if (error.name === 'FirestoreNotInitializedError') {
          const friendlyError = new Error('Database is not available. Please configure Firebase in your native code.');
          setError(friendlyError);
          options?.onError?.(friendlyError);
        } else if (error.name === 'InvalidCollectionPathError') {
          // Keep the detailed error message for InvalidCollectionPathError as it's helpful for debugging
          setError(error);
          options?.onError?.(error);
        } else {
          setError(error);
          options?.onError?.(error);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [path, options]
  );

  const update = useCallback(
    async (data: Partial<T>): Promise<boolean> => {
      if (!path) {
        const err = new Error('Path is required for mutation');
        setError(err);
        options?.onError?.(err);
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await updateDocument<T>(path, data, options);
        options?.onSuccess?.(undefined);
        return true;
      } catch (err) {
        const error = err as Error;
        setError(error);
        options?.onError?.(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [path, options]
  );

  const remove = useCallback(async (): Promise<boolean> => {
    if (!path) {
      const err = new Error('Path is required for mutation');
      setError(err);
      options?.onError?.(err);
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteDocument(path, options);
      options?.onSuccess?.(undefined);
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [path, options]);

  return {
    create,
    update,
    delete: remove,
    loading,
    error,
  };
}

/**
 * Hook for batch operations
 */
export function useBatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (
      operations: (batch: ReturnType<typeof createBatch>) => void,
      options?: DatabaseOptions
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const batch = createBatch();
        operations(batch);
        await batch.commit(options);
        return true;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { execute, loading, error };
}

/**
 * Hook for transactions
 */
export function useTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async <T>(
      updateFunction: (transaction: any) => Promise<T>,
      options?: DatabaseOptions
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await runDatabaseTransaction(updateFunction, options);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { execute, loading, error };
}

