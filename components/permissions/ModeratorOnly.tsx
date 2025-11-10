/**
 * Moderator Only Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Component that only renders for moderators and admins
 */

import React, { ReactNode } from 'react';
import { PermissionGuard } from './PermissionGuard';

interface ModeratorOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ModeratorOnly({ children, fallback = null }: ModeratorOnlyProps) {
  return (
    <PermissionGuard requiredRole={['admin', 'moderator']} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

