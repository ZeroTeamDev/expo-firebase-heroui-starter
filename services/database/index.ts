/**
 * Database Service Abstraction
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Unified database interface - developers can use this without knowing Firebase implementation
 */

// Re-export all database operations
export {
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
  getDocumentRef,
  getCollectionRef,
  buildQuery,
  isFirestoreInitialized,
  type DatabaseOptions,
  type QueryFilters,
  BatchOperation,
} from '../firebase/database';

// Re-export hooks
export {
  useDocument,
  useCollection,
  useMutation,
  useBatch,
  useTransaction,
  type UseDocumentOptions,
  type UseCollectionOptions,
  type UseMutationOptions,
} from '../../hooks/use-firestore';

// Re-export store
export { useDatabaseStore } from '../../stores/databaseStore';

