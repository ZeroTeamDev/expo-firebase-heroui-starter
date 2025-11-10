/**
 * Editor Only Component
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Component that only renders for editors, moderators, and admins
 */

import React, { ReactNode } from 'react';
import { PermissionGuard } from './PermissionGuard';

interface EditorOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function EditorOnly({ children, fallback = null }: EditorOnlyProps) {
  return (
    <PermissionGuard requiredRole={['admin', 'moderator', 'editor']} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

