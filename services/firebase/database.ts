/**
 * Firebase Database Service
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Developer-friendly abstraction layer for Firestore operations
 * Developers can use this without knowing Firebase implementation details
 */

import {
  getFirestore,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  writeBatch,
  runTransaction,
  type Firestore,
  type DocumentData,
  type QueryConstraint,
  type DocumentReference,
  type CollectionReference,
  type Query,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseApp } from '@/integrations/firebase.client';

let dbInstance: Firestore | null = null;
let hasWarnedAboutInitialization = false; // Track if we've already warned about Firebase not being initialized

/**
 * Check if Firestore is initialized
 */
export function isFirestoreInitialized(): boolean {
  return getFirestoreInstance() !== null;
}

/**
 * Get Firestore instance
 * Returns null if Firebase is not initialized yet (graceful handling)
 */
export function getFirestoreInstance(): Firestore | null {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const app = getFirebaseApp();
    if (!app) {
      // Firebase not initialized yet, return null
      return null;
    }
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (error) {
    // Only warn once to avoid console spam
    if (__DEV__ && !hasWarnedAboutInitialization) {
      console.warn('[Database] Failed to initialize Firestore. Firebase needs to be configured in native code.');
      hasWarnedAboutInitialization = true;
    }
    return null;
  }
}

/**
 * Database operation options
 */
export interface DatabaseOptions {
  retryCount?: number;
  retryDelay?: number;
  enableCache?: boolean;
  enableOffline?: boolean;
}

/**
 * Query filters for collections
 */
export interface QueryFilters {
  where?: Array<[string, '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in', any]>;
  orderBy?: Array<[string, 'asc' | 'desc']>;
  limit?: number;
  startAfter?: DocumentData;
}

/**
 * Get document reference
 */
export function getDocumentRef<T = DocumentData>(path: string): DocumentReference<T> | null {
  const db = getFirestoreInstance();
  if (!db) {
    return null;
  }
  return doc(db, path) as DocumentReference<T>;
}

/**
 * Get collection reference
 */
export function getCollectionRef<T = DocumentData>(path: string): CollectionReference<T> | null {
  const db = getFirestoreInstance();
  if (!db) {
    return null;
  }
  return collection(db, path) as CollectionReference<T>;
}

/**
 * Build query with filters
 */
export function buildQuery<T = DocumentData>(
  collectionRef: CollectionReference<T> | null,
  filters?: QueryFilters
): Query<T> | null {
  if (!collectionRef) {
    return null;
  }
  let q: Query<T> = collectionRef;

  if (filters?.where) {
    for (const [field, operator, value] of filters.where) {
      q = query(q, where(field, operator, value)) as Query<T>;
    }
  }

  if (filters?.orderBy) {
    for (const [field, direction] of filters.orderBy) {
      q = query(q, orderBy(field, direction)) as Query<T>;
    }
  }

  if (filters?.limit) {
    q = query(q, limit(filters.limit)) as Query<T>;
  }

  if (filters?.startAfter) {
    q = query(q, startAfter(filters.startAfter)) as Query<T>;
  }

  return q;
}

/**
 * Retry operation with exponential backoff
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  retryCount = 3,
  retryDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < retryCount; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < retryCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, i)));
      }
    }
  }

  throw lastError || new Error('Operation failed after retries');
}

/**
 * Read a single document
 */
export async function readDocument<T = DocumentData>(
  path: string,
  options?: DatabaseOptions
): Promise<T | null> {
  try {
    const docRef = getDocumentRef<T>(path);
    if (!docRef) {
      // Don't log warning - error is handled gracefully by returning null
      // Warning banner in UI will inform user if needed
      return null;
    }
    const operation = async () => {
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as T) : null;
    };

    return await retryOperation(operation, options?.retryCount, options?.retryDelay);
  } catch (error) {
    if (__DEV__) {
      console.error(`[Database] Error reading document ${path}:`, error);
    }
    throw error;
  }
}

/**
 * Read a collection
 */
export async function readCollection<T = DocumentData>(
  path: string,
  filters?: QueryFilters,
  options?: DatabaseOptions
): Promise<T[]> {
  try {
    const collectionRef = getCollectionRef<T>(path);
    if (!collectionRef) {
      // Don't log warning - error is handled gracefully by returning empty array
      // Warning banner in UI will inform user if needed
      return [];
    }
    const q = buildQuery(collectionRef, filters);
    if (!q) {
      if (__DEV__) {
        console.warn('[Database] Failed to build query for collection:', path);
      }
      return [];
    }
    const operation = async () => {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as T);
    };

    return await retryOperation(operation, options?.retryCount, options?.retryDelay);
  } catch (error) {
    if (__DEV__) {
      console.error(`[Database] Error reading collection ${path}:`, error);
    }
    throw error;
  }
}

/**
 * Create a document
 */
export async function createDocument<T = DocumentData>(
  path: string,
  data: T,
  options?: DatabaseOptions
): Promise<string> {
  try {
    const docRef = getDocumentRef<T>(path);
    if (!docRef) {
      // Only warn once to avoid console spam
      if (__DEV__ && !hasWarnedAboutInitialization) {
        console.warn('[Database] Firestore not initialized. Firebase needs to be configured in native code.');
        hasWarnedAboutInitialization = true;
      }
      const error = new Error('Firestore is not initialized. Please configure Firebase in your native code (iOS/Android).');
      error.name = 'FirestoreNotInitializedError';
      throw error;
    }
    const operation = async () => {
      await setDoc(docRef, data as DocumentData);
      return docRef.id;
    };

    return await retryOperation(operation, options?.retryCount, options?.retryDelay);
  } catch (error) {
    // Only log error details if it's not the initialization error (to avoid spam)
    if (__DEV__ && error instanceof Error && error.name !== 'FirestoreNotInitializedError') {
      console.error(`[Database] Error creating document ${path}:`, error);
    }
    throw error;
  }
}

/**
 * Create a document with auto-generated ID
 */
export async function createDocumentWithId<T = DocumentData>(
  collectionPath: string,
  data: T,
  options?: DatabaseOptions
): Promise<string> {
  try {
    // Validate collection path (must have odd number of segments)
    const pathParts = collectionPath.split('/').filter(Boolean);
    if (pathParts.length % 2 === 0) {
      const error = new Error(
        `Invalid collection path: "${collectionPath}". Collection paths must have an odd number of segments (e.g., "users", "users/123/posts"), but got ${pathParts.length} segments.`
      );
      error.name = 'InvalidCollectionPathError';
      throw error;
    }

    const collectionRef = getCollectionRef<T>(collectionPath);
    if (!collectionRef) {
      // Don't log warning - error is passed to callback and will be handled by hooks
      // This prevents console spam and long stack traces
      const error = new Error('Firestore is not initialized. Please configure Firebase in your native code (iOS/Android).');
      error.name = 'FirestoreNotInitializedError';
      throw error;
    }
    const operation = async () => {
      const docRef = await addDoc(collectionRef, data as DocumentData);
      return docRef.id;
    };

    return await retryOperation(operation, options?.retryCount, options?.retryDelay);
  } catch (error) {
    // Only log error details if it's not the initialization error (to avoid spam)
    if (__DEV__ && error instanceof Error && error.name !== 'FirestoreNotInitializedError') {
      console.error(`[Database] Error creating document in ${collectionPath}:`, error);
    }
    throw error;
  }
}

/**
 * Update a document
 */
export async function updateDocument<T = DocumentData>(
  path: string,
  data: Partial<T>,
  options?: DatabaseOptions
): Promise<void> {
  try {
    const docRef = getDocumentRef<T>(path);
    if (!docRef) {
      // Only warn once to avoid console spam
      if (__DEV__ && !hasWarnedAboutInitialization) {
        console.warn('[Database] Firestore not initialized. Firebase needs to be configured in native code.');
        hasWarnedAboutInitialization = true;
      }
      const error = new Error('Firestore is not initialized. Please configure Firebase in your native code (iOS/Android).');
      error.name = 'FirestoreNotInitializedError';
      throw error;
    }
    const operation = async () => {
      await updateDoc(docRef, data as DocumentData);
    };

    return await retryOperation(operation, options?.retryCount, options?.retryDelay);
  } catch (error) {
    // Only log error details if it's not the initialization error (to avoid spam)
    if (__DEV__ && error instanceof Error && error.name !== 'FirestoreNotInitializedError') {
      console.error(`[Database] Error updating document ${path}:`, error);
    }
    throw error;
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(
  path: string,
  options?: DatabaseOptions
): Promise<void> {
  try {
    const docRef = getDocumentRef(path);
    if (!docRef) {
      // Only warn once to avoid console spam
      if (__DEV__ && !hasWarnedAboutInitialization) {
        console.warn('[Database] Firestore not initialized. Firebase needs to be configured in native code.');
        hasWarnedAboutInitialization = true;
      }
      const error = new Error('Firestore is not initialized. Please configure Firebase in your native code (iOS/Android).');
      error.name = 'FirestoreNotInitializedError';
      throw error;
    }
    const operation = async () => {
      await deleteDoc(docRef);
    };

    return await retryOperation(operation, options?.retryCount, options?.retryDelay);
  } catch (error) {
    // Only log error details if it's not the initialization error (to avoid spam)
    if (__DEV__ && error instanceof Error && error.name !== 'FirestoreNotInitializedError') {
      console.error(`[Database] Error deleting document ${path}:`, error);
    }
    throw error;
  }
}

/**
 * Subscribe to document changes (real-time)
 */
export function subscribeToDocument<T = DocumentData>(
  path: string,
  callback: (data: T | null, error?: Error) => void
): Unsubscribe {
  try {
    const docRef = getDocumentRef<T>(path);
    if (!docRef) {
      // Don't log warning here - error is passed to callback and will be handled by hooks
      // This prevents console spam and long stack traces
      const error = new Error('Firestore is not initialized. Please configure Firebase in your native code (iOS/Android).');
      error.name = 'FirestoreNotInitializedError';
      callback(null, error);
      return () => {}; // Return no-op unsubscribe
    }
    return onSnapshot(
      docRef,
      (docSnap) => {
        const data = docSnap.exists() ? (docSnap.data() as T) : null;
        callback(data);
      },
      (error) => {
        if (__DEV__) {
          console.error(`[Database] Error subscribing to document ${path}:`, error);
        }
        callback(null, error as Error);
      }
    );
  } catch (error) {
    if (__DEV__) {
      console.error(`[Database] Error setting up subscription for ${path}:`, error);
    }
    callback(null, error as Error);
    return () => {}; // Return no-op unsubscribe
  }
}

/**
 * Subscribe to collection changes (real-time)
 */
export function subscribeToCollection<T = DocumentData>(
  path: string,
  callback: (data: T[], error?: Error) => void,
  filters?: QueryFilters
): Unsubscribe {
  try {
    const collectionRef = getCollectionRef<T>(path);
    if (!collectionRef) {
      // Don't log warning here - error is passed to callback and will be handled by hooks
      // This prevents console spam and long stack traces
      const error = new Error('Firestore is not initialized. Please configure Firebase in your native code (iOS/Android).');
      error.name = 'FirestoreNotInitializedError';
      callback([], error);
      return () => {}; // Return no-op unsubscribe
    }
    const q = buildQuery(collectionRef, filters);
    if (!q) {
      if (__DEV__) {
        console.warn(`[Database] Failed to build query for collection ${path}`);
      }
      callback([], new Error('Failed to build query'));
      return () => {}; // Return no-op unsubscribe
    }
    return onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data() as T);
        callback(data);
      },
      (error) => {
        if (__DEV__) {
          console.error(`[Database] Error subscribing to collection ${path}:`, error);
        }
        callback([], error as Error);
      }
    );
  } catch (error) {
    if (__DEV__) {
      console.error(`[Database] Error setting up subscription for ${path}:`, error);
    }
    callback([], error as Error);
    return () => {}; // Return no-op unsubscribe
  }
}

/**
 * Batch operations
 */
export class BatchOperation {
  private batch: ReturnType<typeof writeBatch> | null = null;

  constructor() {
    const db = getFirestoreInstance();
    if (db) {
      this.batch = writeBatch(db);
    }
  }

  /**
   * Set a document in the batch
   */
  set<T = DocumentData>(path: string, data: T): this {
    if (!this.batch) {
      // Only warn once to avoid console spam
      if (__DEV__ && !hasWarnedAboutInitialization) {
        console.warn('[Database] Firestore not initialized. Firebase needs to be configured in native code.');
        hasWarnedAboutInitialization = true;
      }
      return this;
    }
    const docRef = getDocumentRef<T>(path);
    if (docRef) {
      this.batch.set(docRef, data as DocumentData);
    }
    return this;
  }

  /**
   * Update a document in the batch
   */
  update<T = DocumentData>(path: string, data: Partial<T>): this {
    if (!this.batch) {
      // Only warn once to avoid console spam
      if (__DEV__ && !hasWarnedAboutInitialization) {
        console.warn('[Database] Firestore not initialized. Firebase needs to be configured in native code.');
        hasWarnedAboutInitialization = true;
      }
      return this;
    }
    const docRef = getDocumentRef<T>(path);
    if (docRef) {
      this.batch.update(docRef, data as DocumentData);
    }
    return this;
  }

  /**
   * Delete a document in the batch
   */
  delete(path: string): this {
    if (!this.batch) {
      // Only warn once to avoid console spam
      if (__DEV__ && !hasWarnedAboutInitialization) {
        console.warn('[Database] Firestore not initialized. Firebase needs to be configured in native code.');
        hasWarnedAboutInitialization = true;
      }
      return this;
    }
    const docRef = getDocumentRef(path);
    if (docRef) {
      this.batch.delete(docRef);
    }
    return this;
  }

  /**
   * Commit the batch
   */
  async commit(options?: DatabaseOptions): Promise<void> {
    if (!this.batch) {
      // Only warn once to avoid console spam
      if (__DEV__ && !hasWarnedAboutInitialization) {
        console.warn('[Database] Firestore not initialized. Firebase needs to be configured in native code.');
        hasWarnedAboutInitialization = true;
      }
      return;
    }
    try {
      const operation = async () => {
        await this.batch!.commit();
      };
      await retryOperation(operation, options?.retryCount, options?.retryDelay);
    } catch (error) {
      if (__DEV__) {
        console.error('[Database] Error committing batch:', error);
      }
      throw error;
    }
  }
}

/**
 * Create a new batch operation
 */
export function createBatch(): BatchOperation {
  return new BatchOperation();
}

/**
 * Run a transaction
 */
export async function runDatabaseTransaction<T>(
  updateFunction: (transaction: any) => Promise<T>,
  options?: DatabaseOptions
): Promise<T> {
  try {
    const db = getFirestoreInstance();
    if (!db) {
      // Only warn once to avoid console spam
      if (__DEV__ && !hasWarnedAboutInitialization) {
        console.warn('[Database] Firestore not initialized. Firebase needs to be configured in native code.');
        hasWarnedAboutInitialization = true;
      }
      const error = new Error('Firestore is not initialized. Please configure Firebase in your native code (iOS/Android).');
      error.name = 'FirestoreNotInitializedError';
      throw error;
    }
    const operation = async () => {
      return await runTransaction(db, updateFunction);
    };
    return await retryOperation(operation, options?.retryCount, options?.retryDelay);
  } catch (error) {
    // Only log error details if it's not the initialization error (to avoid spam)
    if (__DEV__ && error instanceof Error && error.name !== 'FirestoreNotInitializedError') {
      console.error('[Database] Error running transaction:', error);
    }
    throw error;
  }
}

