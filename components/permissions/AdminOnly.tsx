/**
 * Admin Only Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Component that only renders for admins
 */

import React, { ReactNode } from 'react';
import { PermissionGuard } from './PermissionGuard';

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  return (
    <PermissionGuard requiredRole="admin" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

