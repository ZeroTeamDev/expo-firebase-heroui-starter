/**
 * Unified Services Export
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Single import point for all services
 * Developers can use: import { useDocument, useAIChat, logEvent } from '@/services';
 */

// Database services
export {
  useDocument,
  useCollection,
  useMutation,
  useBatch,
  useTransaction,
  readDocument,
  readCollection,
  createDocument,
  createDocumentWithId,
  updateDocument,
  deleteDocument,
  subscribeToDocument,
  subscribeToCollection,
  createBatch as createDatabaseBatch,
  runDatabaseTransaction,
  isFirestoreInitialized,
  type UseDocumentOptions,
  type UseCollectionOptions,
  type UseMutationOptions,
  type DatabaseOptions,
  type QueryFilters,
} from './database';

  // AI services
  export {
    useAIChat,
    useAIVision,
    useAIDocument,
    useAIAudio,
    useAIVideo,
    streamChat,
    chat,
    analyzeImage,
    analyzeDocument,
    analyzeAudio,
    analyzeVideo,
    type AIChatRequest,
    type AIVisionRequest,
    type AIDocumentRequest,
    type AIAudioRequest,
    type AIVideoRequest,
    type AIHookOptions,
  } from './ai';

// Analytics services
export {
  logEvent,
  logScreenView,
  setUserProperties,
  setUserId,
  logConversion,
  logPurchase,
  logAddToCart,
  logViewItem,
  logSearch,
  logShare,
  useScreenTracking,
  useEventTracking,
  useUserProperties,
  useUserId,
  useConversionTracking,
  useEcommerceTracking,
  useSearchTracking,
  useShareTracking,
  useAnalyticsPrivacy,
  type AnalyticsParams,
  type EcommerceItem,
} from './analytics';

// Configuration services
export {
  getGlobalConfig,
  updateGlobalConfig,
  getConfigValue,
  isFeatureEnabled,
  getModuleSettings,
  isModuleEnabled,
  subscribeToGlobalConfig,
  syncWithRemoteConfig,
  type GlobalConfig,
} from './config';

// Permission services
export {
  isPermissionSystemEnabled,
  getUserRole,
  getUserProfile,
  canManageUsers,
  canAssignRole,
  canAccessFile,
  canUploadFile,
  canManageGroup,
  getUserFileLimit,
  getUserFileCount,
  type UserProfile,
  type UserRole,
  type FileMetadata,
  type GroupMetadata,
} from './permissions';

// User services
export {
  createUser,
  updateUserRole,
  assignUserToGroup,
  removeUserFromGroup,
  getUserProfile as getUserProfileService,
  listUsers,
  getUserFileStats,
  updateUserProfile,
  incrementUserFileCount,
  decrementUserFileCount,
  type CreateUserData,
  type UpdateUserData,
  type UserStats,
} from './users';

// File services
export {
  createFileMetadata,
  uploadFileWithMetadata,
  updateFileMetadata,
  getFileMetadata,
  deleteFile,
  shareFile,
  unshareFile,
  checkFileAccess,
  getUserFiles,
  getGroupFiles,
  getAppFiles,
  listFiles,
  type CreateFileData,
  type FileUploadData,
} from './files';

// Storage services
export {
  uploadFile,
  getFileUrl,
  deleteFileFromStorage,
  validateFileSize,
  validateFileType,
  formatFileSize,
  type UploadFileOptions,
  type UploadResult,
} from './storage';

// Group services
export {
  createGroup,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
  getGroup,
  getUserGroup,
  listGroups,
  validateGroupAssignment,
  type CreateGroupData,
  type UpdateGroupData,
} from './groups';

