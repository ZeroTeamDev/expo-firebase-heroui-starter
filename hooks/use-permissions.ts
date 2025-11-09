/**
 * Permission Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * React hooks for checking user permissions
 */

import React, { useEffect, useState } from 'react';
import { usePermissionStore } from '@/stores/permissionStore';
import { useAuthStore } from '@/stores/authStore';
import {
  canManageUsers,
  canAccessFile,
  canUploadFile,
  canManageGroup,
  type UserRole,
} from '@/services/permissions/permission.service';

/**
 * Get current user permissions
 */
export function usePermissions(): {
  role: UserRole | null;
  profile: any;
  loading: boolean;
  error: Error | null;
} {
  const user = useAuthStore((state) => state.user);
  const role = usePermissionStore((state) => state.role);
  const profile = usePermissionStore((state) => state.profile);
  const loading = usePermissionStore((state) => state.loading);
  const error = usePermissionStore((state) => state.error);
  const loadPermissions = usePermissionStore((state) => state.loadPermissions);
  const reset = usePermissionStore((state) => state.reset);

  useEffect(() => {
    if (user?.uid) {
      loadPermissions(user.uid);
    } else {
      reset();
    }
  }, [user?.uid, loadPermissions, reset]);

  return { role, profile, loading, error };
}

/**
 * Get current user role
 */
export function useUserRole(): UserRole | null {
  const { role } = usePermissions();
  return role;
}

/**
 * Check if current user is admin
 */
export function useIsAdmin(): boolean {
  const role = useUserRole();
  return role === 'admin';
}

/**
 * Check if current user is moderator
 */
export function useIsModerator(): boolean {
  const role = useUserRole();
  return role === 'moderator' || role === 'admin';
}

/**
 * Check if current user is editor
 */
export function useIsEditor(): boolean {
  const role = useUserRole();
  return role === 'editor' || role === 'moderator' || role === 'admin';
}

/**
 * Check if current user can manage users
 */
export function useCanManageUsers(): {
  canManage: boolean;
  loading: boolean;
} {
  const user = useAuthStore((state) => state.user);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setCanManage(false);
      setLoading(false);
      return;
    }

    canManageUsers(user.uid)
      .then((result) => {
        setCanManage(result);
        setLoading(false);
      })
      .catch(() => {
        setCanManage(false);
        setLoading(false);
      });
  }, [user?.uid]);

  return { canManage, loading };
}

/**
 * Check if current user can upload file
 */
export function useCanUploadFile(fileSize: number): {
  allowed: boolean;
  reason?: string;
  loading: boolean;
} {
  const user = useAuthStore((state) => state.user);
  const [result, setResult] = useState<{
    allowed: boolean;
    reason?: string;
  }>({ allowed: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setResult({ allowed: false, reason: 'User not authenticated' });
      setLoading(false);
      return;
    }

    canUploadFile(user.uid, fileSize)
      .then((res) => {
        setResult(res);
        setLoading(false);
      })
      .catch(() => {
        setResult({ allowed: false, reason: 'Failed to check upload permission' });
        setLoading(false);
      });
  }, [user?.uid, fileSize]);

  return { ...result, loading };
}

/**
 * Get current user file upload limit
 */
export function useUserFileLimit(): number {
  const fileLimit = usePermissionStore((state) => state.fileLimit);
  return fileLimit;
}

/**
 * Get current user file upload count
 */
export function useUserFileCount(): number {
  const fileCount = usePermissionStore((state) => state.fileCount);
  return fileCount;
}

/**
 * Check if user can access file
 */
export function useFileAccess(fileId: string): {
  canAccess: boolean;
  loading: boolean;
} {
  const user = useAuthStore((state) => state.user);
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !fileId) {
      setCanAccess(false);
      setLoading(false);
      return;
    }

    canAccessFile(user.uid, fileId)
      .then((result) => {
        setCanAccess(result);
        setLoading(false);
      })
      .catch(() => {
        setCanAccess(false);
        setLoading(false);
      });
  }, [user?.uid, fileId]);

  return { canAccess, loading };
}

/**
 * Check if user can manage group
 */
export function useCanManageGroup(groupId: string): {
  canManage: boolean;
  loading: boolean;
} {
  const user = useAuthStore((state) => state.user);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !groupId) {
      setCanManage(false);
      setLoading(false);
      return;
    }

    canManageGroup(user.uid, groupId)
      .then((result) => {
        setCanManage(result);
        setLoading(false);
      })
      .catch(() => {
        setCanManage(false);
        setLoading(false);
      });
  }, [user?.uid, groupId]);

  return { canManage, loading };
}

