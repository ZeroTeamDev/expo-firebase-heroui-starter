# Advanced Account and File Management System Plan

Created by Kien AI (leejungkiin@gmail.com)

## Overview

Implement an advanced account management system with role-based access control (RBAC) and a comprehensive file management system for a flexible starter kit. The system supports both simple single-user apps and complex multi-user applications with granular permissions. All features are toggleable via environment variables and global configuration.

## Architecture

### 1. Permission System Architecture

#### Environment Configuration
- Add `EXPO_PUBLIC_ENABLE_PERMISSIONS` environment variable (default: `false`)
- When `false`: All users get default "user" role, no permission UI shown, simple file management
- When `true`: Full RBAC system enabled with admin capabilities, group management, and advanced file features

#### Role System
- **Admin**: Highest privilege, can create/manage users, assign roles, manage all files, configure global settings
- **Moderator**: Can manage users (except admins), moderate content, manage group files
- **Editor**: Can create/edit content, manage assigned files, limited user management
- **User**: Default role, can manage personal files and files in their group (if assigned)
- Roles stored in Firestore `users/{userId}/role` field
- Admin can assign/change roles for other users
- Default role assigned automatically on user creation if permissions disabled

#### Database Schema

**Users Collection** (`users/{userId}`)
```typescript
{
  email: string;
  displayName: string;
  role: 'admin' | 'moderator' | 'editor' | 'user'; // Only if permissions enabled, default: 'user'
  groupId?: string; // Only one group per user (nullable, enforced)
  createdAt: timestamp;
  updatedAt: timestamp;
  fileUploadCount: number; // Track file upload count for limits
  lastFileUploadAt?: timestamp;
}
```

**Groups Collection** (`groups/{groupId}`)
```typescript
{
  name: string;
  description?: string;
  ownerId: string; // User ID of group owner (admin or moderator)
  memberIds: string[]; // Array of user IDs (max 1 group per user enforced)
  createdAt: timestamp;
  updatedAt: timestamp;
  settings?: {
    maxFileSize?: number; // Override global config
    maxFileCount?: number; // Override global config
  };
}
```

**Global Config Collection** (`config/global`)
```typescript
{
  // Authentication
  enableRegistration: boolean; // Allow new user registration
  requireEmailVerification: boolean;
  
  // File Management
  enableFileManagement: boolean; // Enable file management feature
  maxFileSize: number; // Max file size in bytes (default: 10MB)
  maxFileCount: number; // Max files per user without group (default: 10)
  maxFileCountWithGroup: number; // Max files per user with group (default: 100)
  allowedFileTypes: string[]; // Allowed MIME types (empty = all)
  
  // Modules
  enabledModules: string[]; // List of enabled module IDs
  moduleSettings: {
    [moduleId: string]: {
      enabled: boolean;
      settings?: Record<string, any>;
    };
  };
  
  // Permissions
  enablePermissions: boolean; // Enable RBAC system
  enableGroups: boolean; // Enable group management
  
  // System
  maintenanceMode: boolean; // Put app in maintenance mode
  maintenanceMessage?: string;
  
  updatedBy: string; // User ID who last updated
  updatedAt: timestamp;
}
```

**Files Collection** (`files/{fileId}`)
```typescript
{
  name: string;
  type: 'personal' | 'app' | 'group'; // personal: user's file, app: app-wide file, group: group file
  ownerId: string; // User ID who uploaded
  groupId?: string; // For group files
  storagePath: string; // Firebase Storage path
  mimeType: string;
  size: number;
  // Access control (simple: can access or not)
  accessibleBy: string[]; // Array of user IDs who can access (empty = only owner)
  isPublic: boolean; // Public access (all authenticated users)
  isAppFile: boolean; // App-wide file (accessible by all users)
  createdAt: timestamp;
  updatedAt: timestamp;
  metadata?: Record<string, any>; // Additional metadata
}
```

### 2. File Management System

#### File Types
1. **Personal Files**: Owned by user, accessible by owner only (unless shared)
2. **App Files**: App-wide files, accessible by all authenticated users (uploaded by admin/moderator)
3. **Group Files**: Belong to a group, accessible by all group members

#### Storage Structure
```
firebase-storage/
  users/
    {userId}/
      personal/
        {fileId}/
  app/
    {fileId}/  # App-wide files
  groups/
    {groupId}/
      {fileId}/
```

#### Permission Logic
- **Personal files**: Only owner has access (unless explicitly shared via `accessibleBy` array)
- **App files**: All authenticated users can access (uploaded by admin/moderator)
- **Group files**: All group members can access (uploaded by group members)
- **Admin/Moderator**: Full access to all files
- **User without group**: Limited file upload count (configurable in global config)
- **User with group**: Higher file upload limit (configurable in global config)

#### File Upload Limits
- Users without group: Limited by `maxFileCount` (default: 10 files)
- Users with group: Limited by `maxFileCountWithGroup` (default: 100 files)
- File size limit: Controlled by `maxFileSize` (default: 10MB)
- Admin can configure limits in global config
- Group-specific limits can override global limits

### 3. Global Configuration System

#### Features
- **Centralized Configuration**: Single source of truth for app settings
- **Admin UI**: Visual interface for admins to configure settings
- **Environment Variables**: Fallback and override via `.env`
- **Remote Config Integration**: Sync with Firebase Remote Config (optional)
- **Module Management**: Enable/disable modules via config
- **Feature Flags**: Toggle features on/off without code changes

#### Configuration Categories
1. **Authentication**: Registration, email verification, login methods
2. **File Management**: Limits, allowed types, storage settings
3. **Modules**: Enable/disable modules, module-specific settings
4. **Permissions**: Enable RBAC, group management
5. **System**: Maintenance mode, app-wide settings

### 4. Implementation Plan

#### Phase 1: Global Configuration System

**Files to Create/Modify:**

1. **Environment Configuration** (`.env.example`)
   ```bash
   # Permissions
   EXPO_PUBLIC_ENABLE_PERMISSIONS=false
   EXPO_PUBLIC_ENABLE_GROUPS=false
   
   # File Management
   EXPO_PUBLIC_ENABLE_FILE_MANAGEMENT=true
   EXPO_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB in bytes
   EXPO_PUBLIC_MAX_FILE_COUNT=10
   EXPO_PUBLIC_MAX_FILE_COUNT_WITH_GROUP=100
   
   # Authentication
   EXPO_PUBLIC_ENABLE_REGISTRATION=true
   EXPO_PUBLIC_REQUIRE_EMAIL_VERIFICATION=false
   
   # Modules (comma-separated)
   EXPO_PUBLIC_ENABLED_MODULES=weather,entertainment,ai-tools
   ```

2. **Global Config Service** (`services/config/global-config.service.ts`)
   - `getGlobalConfig()`: Get global configuration
   - `updateGlobalConfig(updates)`: Update global config (admin only)
   - `getConfigValue(key)`: Get specific config value
   - `isFeatureEnabled(feature)`: Check if feature is enabled
   - `getModuleSettings(moduleId)`: Get module-specific settings
   - `syncWithRemoteConfig()`: Sync with Firebase Remote Config

3. **Config Store** (`stores/configStore.ts`)
   - Store global configuration
   - Cache config values
   - Real-time updates from Firestore

4. **Config Hooks** (`hooks/use-config.ts`)
   - `useGlobalConfig()`: Get global configuration
   - `useConfigValue(key)`: Get specific config value
   - `useIsFeatureEnabled(feature)`: Check if feature is enabled
   - `useModuleEnabled(moduleId)`: Check if module is enabled

#### Phase 2: Permission System Foundation

**Files to Create/Modify:**

1. **Permission Service** (`services/permissions/permission.service.ts`)
   - `isPermissionEnabled()`: Check if permission system is enabled
   - `getUserRole(userId)`: Get user role
   - `canManageUsers(userId)`: Check if user can manage other users
   - `canAssignRole(userId, targetRole)`: Check if user can assign role
   - `canAccessFile(userId, fileId)`: Check if user can access file
   - `canUploadFile(userId)`: Check if user can upload file (check limits)
   - `canManageGroup(userId, groupId)`: Check if user can manage group
   - `getUserFileLimit(userId)`: Get file upload limit for user

2. **User Service Extension** (`services/users/user.service.ts`)
   - `createUser(userData, role?)`: Create user with optional role
   - `updateUserRole(userId, role)`: Update user role (admin only)
   - `assignUserToGroup(userId, groupId)`: Assign user to group (1 group max, enforce)
   - `removeUserFromGroup(userId)`: Remove user from group
   - `getUserProfile(userId)`: Get user profile with role and group
   - `listUsers(filters?)`: List users with filters (admin/moderator only)
   - `getUserFileStats(userId)`: Get user file upload statistics

3. **Permission Hooks** (`hooks/use-permissions.ts`)
   - `usePermissions()`: Get current user permissions
   - `useUserRole()`: Get current user role
   - `useIsAdmin()`: Check if current user is admin
   - `useIsModerator()`: Check if current user is moderator
   - `useIsEditor()`: Check if current user is editor
   - `useCanManageUsers()`: Check if current user can manage users
   - `useCanUploadFile()`: Check if current user can upload file
   - `useUserFileLimit()`: Get current user file upload limit
   - `useUserFileCount()`: Get current user file upload count

4. **Permission Store** (`stores/permissionStore.ts`)
   - Store current user role and permissions
   - Cache permission checks
   - Sync with Firestore

#### Phase 3: File Management System

**Files to Create:**

1. **Storage Service** (`services/storage/storage.service.ts`)
   - `uploadFile(file, type, metadata)`: Upload file to Firebase Storage
   - `downloadFile(fileId)`: Download file from Firebase Storage
   - `deleteFile(fileId)`: Delete file from storage and database
   - `getFileUrl(fileId)`: Get download URL for file
   - `listFiles(filters)`: List files with filters and permissions
   - `validateFileSize(file, maxSize)`: Validate file size
   - `validateFileType(file, allowedTypes)`: Validate file type

2. **File Service** (`services/files/file.service.ts`)
   - `createFileMetadata(fileData)`: Create file metadata in Firestore
   - `updateFileMetadata(fileId, updates)`: Update file metadata
   - `getFileMetadata(fileId)`: Get file metadata
   - `deleteFile(fileId)`: Delete file and metadata
   - `shareFile(fileId, userId)`: Share file with user (add to accessibleBy)
   - `unshareFile(fileId, userId)`: Remove file access for user
   - `checkFileAccess(userId, fileId)`: Check if user can access file
   - `getUserFiles(userId, filters?)`: Get user's files
   - `getGroupFiles(groupId)`: Get group files
   - `getAppFiles()`: Get app-wide files

3. **File Hooks** (`hooks/use-files.ts`)
   - `useFiles(filters)`: Get files with real-time updates
   - `useFile(fileId)`: Get single file
   - `useUploadFile()`: Upload file hook with validation
   - `useDeleteFile()`: Delete file hook
   - `useFileAccess(fileId)`: Check file access
   - `useUserFiles(userId)`: Get user's files
   - `useGroupFiles(groupId)`: Get group files
   - `useAppFiles()`: Get app-wide files

#### Phase 4: Group Management System

**Files to Create:**

1. **Group Service** (`services/groups/group.service.ts`)
   - `createGroup(groupData)`: Create group (admin/moderator only)
   - `updateGroup(groupId, updates)`: Update group (admin/moderator/owner)
   - `deleteGroup(groupId)`: Delete group (admin/owner)
   - `addGroupMember(groupId, userId)`: Add member to group (enforce 1 group per user)
   - `removeGroupMember(groupId, userId)`: Remove member from group
   - `getGroup(groupId)`: Get group details
   - `getUserGroup(userId)`: Get user's group (1 group max)
   - `listGroups(filters?)`: List groups (admin/moderator)
   - `validateGroupAssignment(userId, groupId)`: Validate user can be assigned to group

2. **Group Hooks** (`hooks/use-groups.ts`)
   - `useGroups()`: Get all groups (admin/moderator)
   - `useGroup(groupId)`: Get specific group
   - `useUserGroup()`: Get current user's group
   - `useCreateGroup()`: Create group hook
   - `useUpdateGroup()`: Update group hook
   - `useDeleteGroup()`: Delete group hook
   - `useAddGroupMember()`: Add member hook
   - `useRemoveGroupMember()`: Remove member hook

#### Phase 5: UI Components

**Files to Create:**

1. **Admin Panel** (`app/(tabs)/admin/`)
   - **Global Config Screen**: Configure app-wide settings
     - Authentication settings (registration, email verification)
     - File management settings (limits, allowed types)
     - Module management (enable/disable modules)
     - Permission settings (enable RBAC, groups)
     - System settings (maintenance mode)
   - **User Management Screen**: Manage users and roles
     - List all users with filters
     - Assign/change user roles
     - Assign users to groups
     - View user statistics (file count, etc.)
   - **File Management Screen**: Manage all files
     - List all files with filters
     - Upload app-wide files
     - Delete files
     - View file statistics
   - **Group Management Screen**: Manage groups
     - List all groups
     - Create/edit/delete groups
     - Manage group members
     - Configure group settings

2. **File Management UI** (`components/files/`)
   - `FileUpload.tsx`: File upload component with progress and validation
   - `FileList.tsx`: File list with filters (personal, app, group)
   - `FileItem.tsx`: Single file item with actions (view, download, delete, share)
   - `FileShareDialog.tsx`: Share file with users
   - `FilePreview.tsx`: File preview component
   - `FileStats.tsx`: Display file upload statistics and limits
   - `FileUploadLimit.tsx`: Display upload limit warning

3. **Group Management UI** (`components/groups/`)
   - `GroupList.tsx`: List of groups (admin/moderator)
   - `GroupForm.tsx`: Create/edit group form
   - `GroupMembers.tsx`: Group members management
   - `GroupSettings.tsx`: Group-specific settings (file limits override)
   - `UserGroupCard.tsx`: Display user's current group
   - `JoinGroupDialog.tsx`: Dialog to join a group (if enabled)

4. **Global Config UI** (`components/config/`)
   - `GlobalConfigForm.tsx`: Main configuration form
   - `AuthConfigSection.tsx`: Authentication settings
   - `FileConfigSection.tsx`: File management settings
   - `ModuleConfigSection.tsx`: Module management
   - `PermissionConfigSection.tsx`: Permission settings
   - `SystemConfigSection.tsx`: System settings

5. **Permission Guards** (`components/permissions/`)
   - `PermissionGuard.tsx`: Component to guard routes based on permissions
   - `AdminOnly.tsx`: Component that only renders for admins
   - `ModeratorOnly.tsx`: Component that only renders for moderators/admins
   - `EditorOnly.tsx`: Component that only renders for editors/admins
   - `HasRole.tsx`: Component that renders based on role
   - `FeatureGuard.tsx`: Component that renders based on feature flag

#### Phase 6: Integration and Enhancements

**Additional Features for Starter Kit:**

1. **User Dashboard** (`app/(tabs)/dashboard.tsx`)
   - User statistics (file count, group info)
   - Quick actions (upload file, join group)
   - Recent files
   - Notifications

2. **File Sharing System**
   - Share personal files with specific users
   - Generate shareable links (if enabled)
   - Access control for shared files

3. **File Organization**
   - Folders/categories for files
   - Tags for files
   - Search and filter files

4. **Activity Log**
   - Track file uploads, deletions
   - Track user actions (admin view)
   - Audit trail for security

5. **Notifications System**
   - Notify users about file shares
   - Notify admins about system events
   - Notify group members about group changes

6. **Export/Import**
   - Export user data
   - Import users (admin)
   - Backup/restore configuration

#### Phase 7: Integration

**Files to Modify:**

1. **AuthProvider** (`providers/AuthProvider.tsx`)
   - Load user permissions on auth state change
   - Initialize permission store
   - Load global config

2. **Module System** (`modules/types.ts`)
   - Add permission requirements to modules
   - Check permissions before showing modules
   - Respect global config module settings

3. **Navigation** (`app/(tabs)/_layout.tsx`)
   - Hide admin tabs if user is not admin
   - Hide permission-related UI if permissions disabled
   - Hide modules based on global config

4. **Settings Screen** (`app/(tabs)/settings.tsx`)
   - Add user management section (admin only)
   - Add file management section
   - Add group management section (if enabled)
   - Add global config section (admin only)

### 5. Security Rules

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to get user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isAdmin() {
      return getUserRole() == 'admin';
    }
    
    function isModerator() {
      return getUserRole() == 'moderator' || isAdmin();
    }
    
    function isEditor() {
      return getUserRole() == 'editor' || isModerator();
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == userId || isAdmin() || (isModerator() && resource.data.role != 'admin'));
      allow delete: if request.auth != null && isAdmin();
    }
    
    // Groups collection
    match /groups/{groupId} {
      allow read: if request.auth != null &&
        (resource.data.memberIds.hasAny([request.auth.uid]) || isModerator());
      allow create: if request.auth != null && isModerator();
      allow update: if request.auth != null &&
        (resource.data.ownerId == request.auth.uid || isModerator());
      allow delete: if request.auth != null &&
        (resource.data.ownerId == request.auth.uid || isAdmin());
    }
    
    // Files collection
    match /files/{fileId} {
      allow read: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid ||
         resource.data.accessibleBy.hasAny([request.auth.uid]) ||
         resource.data.isPublic == true ||
         resource.data.isAppFile == true ||
         (resource.data.type == 'group' && 
          exists(/databases/$(database)/documents/groups/$(resource.data.groupId)) &&
          get(/databases/$(database)/documents/groups/$(resource.data.groupId)).data.memberIds.hasAny([request.auth.uid])) ||
         isModerator());
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.ownerId == request.auth.uid || isModerator());
      allow delete: if request.auth != null &&
        (resource.data.ownerId == request.auth.uid || isModerator());
    }
    
    // Global config collection
    match /config/global {
      allow read: if request.auth != null;
      allow write: if request.auth != null && isAdmin();
    }
  }
}
```

#### Firebase Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check file access in Firestore
    function canAccessFile(fileId) {
      return firestore.get(/databases/(default)/documents/files/$(fileId)).data.ownerId == request.auth.uid ||
             firestore.get(/databases/(default)/documents/files/$(fileId)).data.accessibleBy.hasAny([request.auth.uid]) ||
             firestore.get(/databases/(default)/documents/files/$(fileId)).data.isPublic == true ||
             firestore.get(/databases/(default)/documents/files/$(fileId)).data.isAppFile == true ||
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'moderator';
    }
    
    // User personal files
    match /users/{userId}/personal/{fileId}/{allPaths=**} {
      allow read: if request.auth != null && canAccessFile(fileId);
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // App-wide files
    match /app/{fileId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'moderator');
    }
    
    // Group files
    match /groups/{groupId}/{fileId}/{allPaths=**} {
      allow read: if request.auth != null && 
        (firestore.get(/databases/(default)/documents/groups/$(groupId)).data.memberIds.hasAny([request.auth.uid]) ||
         canAccessFile(fileId));
      allow write: if request.auth != null &&
        firestore.get(/databases/(default)/documents/groups/$(groupId)).data.memberIds.hasAny([request.auth.uid]);
    }
  }
}
```

### 6. Testing Strategy

1. **Unit Tests**
   - Permission service tests
   - File service tests
   - Group service tests
   - Config service tests

2. **Integration Tests**
   - File upload/download flow
   - Permission checks
   - Admin user management flow
   - Group assignment (enforce 1 group per user)

3. **E2E Tests**
   - Complete file management workflow
   - Admin panel functionality
   - Permission-based access control
   - Group management flow

### 7. Documentation

1. **API Documentation**
   - Permission service API
   - File service API
   - Group service API
   - Config service API

2. **User Guide**
   - How to enable/disable permissions
   - How to use file management
   - How to manage groups
   - Admin user guide
   - Global configuration guide

3. **Developer Guide**
   - How to add new permissions
   - How to extend file types
   - How to add new roles
   - How to configure modules
   - How to customize global config

## Implementation Order

1. Phase 1: Global Configuration System (Foundation for all features)
2. Phase 2: Permission System Foundation (RBAC core)
3. Phase 3: File Management System (Storage and metadata)
4. Phase 4: Group Management System (Group functionality)
5. Phase 5: UI Components (User interface)
6. Phase 6: Integration and Enhancements (Additional features)
7. Phase 7: Integration (Connect everything)
8. Security Rules (Firestore and Storage)
9. Testing and Documentation

## Notes

### Configuration Priority
1. **Firestore Global Config** (highest priority) - Admin-configured settings
2. **Environment Variables** - Development/staging overrides
3. **Default Values** - Fallback if not configured

### Permission System
- All permission checks must respect the `EXPO_PUBLIC_ENABLE_PERMISSIONS` flag
- When permissions are disabled, all users get default "user" role automatically
- Admin UI should be hidden when permissions are disabled
- Role hierarchy: Admin > Moderator > Editor > User
- Admin can assign any role to any user
- Moderator can assign editor/user roles only
- Editor has limited management capabilities

### File Management
- File management works even when permissions are disabled (personal files only)
- Users without group have lower file upload limits
- Users with group have higher file upload limits
- Admin/Moderator can upload app-wide files accessible by all users
- File size and count limits are configurable per user/group
- File access is simple: can access or not (no read/write/delete granularity)

### Group Management
- Groups require permissions to be enabled
- 1 user can only be in 1 group (enforced at service level and Firestore rules)
- Group owners can manage group members
- Admin/Moderator can manage all groups
- Group assignment automatically removes user from previous group

### Module System
- Modules can be enabled/disabled via global config
- Module settings can be configured per module
- Environment variables can override module settings
- Modules respect permission system if enabled

### Starter Kit Flexibility
- Simple apps: Disable permissions, use basic file management
- Complex apps: Enable permissions, use full RBAC and group management
- All features are optional and toggleable
- Configuration-driven architecture allows easy customization
- Global config provides centralized control for admins
- Environment variables provide development/staging overrides

## To-dos

- [ ] Phase 1: Global Configuration System
- [ ] Phase 2: Permission System Foundation
- [ ] Phase 3: File Management System
- [ ] Phase 4: Group Management System
- [ ] Phase 5: UI Components
- [ ] Phase 6: Integration and Enhancements
- [ ] Phase 7: Integration
- [ ] Security Rules
- [ ] Testing
- [ ] Documentation

