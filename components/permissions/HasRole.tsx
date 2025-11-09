/**
 * Has Role Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Component that renders based on role
 */

import React, { ReactNode } from 'react';
import { PermissionGuard } from './PermissionGuard';
import type { UserRole } from '@/utils/permissions';

interface HasRoleProps {
  children: ReactNode;
  role: UserRole | UserRole[];
  fallback?: ReactNode;
}

export function HasRole({ children, role, fallback = null }: HasRoleProps) {
  return (
    <PermissionGuard requiredRole={role} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

