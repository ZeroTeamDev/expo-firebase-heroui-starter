/**
 * Group Permissions Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * React hooks for group permissions and limits
 */

import { useState, useEffect } from 'react';
import { getGroup } from '@/services/groups/group.service';
import type { GroupMetadata, GroupPermissions } from '@/services/permissions/permission.service';

/**
 * Get group permissions and limits
 */
export function useGroupPermissions(groupId: string | null | undefined): {
  permissions: GroupPermissions | null;
  loading: boolean;
  error: Error | null;
} {
  const [permissions, setPermissions] = useState<GroupPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) {
      setPermissions(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getGroup(groupId)
      .then((group) => {
        if (group?.permissions) {
          setPermissions(group.permissions);
        } else {
          setPermissions(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err as Error);
        setLoading(false);
      });
  }, [groupId]);

  return { permissions, loading, error };
}

/**
 * Get group file upload limits
 */
export function useGroupFileLimits(groupId: string | null | undefined): {
  maxFileSize: number | null;
  maxFileCount: number | null;
  loading: boolean;
} {
  const { permissions, loading } = useGroupPermissions(groupId);

  return {
    maxFileSize: permissions?.maxFileSize || null,
    maxFileCount: permissions?.maxFileCount || null,
    loading,
  };
}

