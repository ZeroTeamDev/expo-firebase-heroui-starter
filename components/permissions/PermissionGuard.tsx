/**
 * Permission Guard Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Component that guards routes based on permissions
 */

import React, { ReactNode } from 'react';
import { useIsAdmin, useIsModerator, useIsEditor, useUserRole } from '@/hooks/use-permissions';
import { usePermissionsEnabled } from '@/hooks/use-config';
import type { UserRole } from '@/utils/permissions';

interface PermissionGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  requirePermission?: boolean;
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  requiredRole,
  requirePermission = false,
  fallback = null,
}: PermissionGuardProps) {
  const permissionsEnabled = usePermissionsEnabled();
  const isAdmin = useIsAdmin();
  const isModerator = useIsModerator();
  const isEditor = useIsEditor();
  const userRole = useUserRole();

  // If permissions are not enabled, allow access if requirePermission is false
  if (!permissionsEnabled) {
    if (requirePermission) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // If no role required, allow access
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check if user has required role
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasRequiredRole = requiredRoles.some((role) => {
    switch (role) {
      case 'admin':
        return isAdmin;
      case 'moderator':
        return isModerator;
      case 'editor':
        return isEditor;
      case 'user':
        return userRole !== null;
      default:
        return false;
    }
  });

  if (!hasRequiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

