/**
 * Group Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * React hooks for group operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { usePermissions } from './use-permissions';
import {
  createGroup,
  updateGroup,
  deleteGroup as deleteGroupService,
  addGroupMember,
  removeGroupMember,
  getGroup,
  getUserGroup,
  listGroups,
  validateGroupAssignment,
  type CreateGroupData,
  type UpdateGroupData,
} from '@/services/groups/group.service';
import {
  subscribeToDocument,
  subscribeToCollection,
} from '@/services/firebase/database';
import type { GroupMetadata } from '@/services/permissions/permission.service';

/**
 * Get all groups (admin/moderator)
 */
export function useGroups() {
  const user = useAuthStore((state) => state.user);
  const [groups, setGroups] = useState<GroupMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setGroups([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToCollection<GroupMetadata>(
      'groups',
      (groupList, err) => {
        if (err) {
          setError(err);
          setLoading(false);
          return;
        }

        // Ensure each group has an id field
        const groupsWithId = groupList.map((group) => ({
          ...group,
          id: (group as any).id || '',
        }));
        
        setGroups(groupsWithId);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return { groups, loading, error };
}

/**
 * Get specific group
 */
export function useGroup(groupId: string | null) {
  const [group, setGroup] = useState<GroupMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) {
      setGroup(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToDocument<GroupMetadata>(
      `groups/${groupId}`,
      (groupData, err) => {
        if (err) {
          setError(err);
          setLoading(false);
          return;
        }

        if (groupData) {
          groupData.id = groupId;
        }

        setGroup(groupData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  return { group, loading, error };
}

/**
 * Get current user's group
 */
export function useUserGroup() {
  const user = useAuthStore((state) => state.user);
  const { profile } = usePermissions();
  const groupId = profile?.groupId;

  return useGroup(groupId || null);
}

/**
 * Create group hook
 */
export function useCreateGroup() {
  const user = useAuthStore((state) => state.user);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (groupData: CreateGroupData) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setCreating(true);
      setError(null);

      try {
        const groupId = await createGroup(
          {
            ...groupData,
            ownerId: groupData.ownerId || user.uid,
          },
          user.uid
        );
        return groupId;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setCreating(false);
      }
    },
    [user?.uid]
  );

  return { create, creating, error };
}

/**
 * Update group hook
 */
export function useUpdateGroup() {
  const user = useAuthStore((state) => state.user);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (groupId: string, updates: UpdateGroupData) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setUpdating(true);
      setError(null);

      try {
        await updateGroup(groupId, updates, user.uid);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setUpdating(false);
      }
    },
    [user?.uid]
  );

  return { update, updating, error };
}

/**
 * Delete group hook
 */
export function useDeleteGroup() {
  const user = useAuthStore((state) => state.user);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteGroup = useCallback(
    async (groupId: string) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setDeleting(true);
      setError(null);

      try {
        await deleteGroupService(groupId, user.uid);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setDeleting(false);
      }
    },
    [user?.uid]
  );

  return { deleteGroup, deleting, error };
}

/**
 * Add group member hook
 */
export function useAddGroupMember() {
  const user = useAuthStore((state) => state.user);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addMember = useCallback(
    async (groupId: string, userId: string) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setAdding(true);
      setError(null);

      try {
        await addGroupMember(groupId, userId, user.uid);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setAdding(false);
      }
    },
    [user?.uid]
  );

  return { addMember, adding, error };
}

/**
 * Remove group member hook
 */
export function useRemoveGroupMember() {
  const user = useAuthStore((state) => state.user);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const removeMember = useCallback(
    async (groupId: string, userId: string) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setRemoving(true);
      setError(null);

      try {
        await removeGroupMember(groupId, userId, user.uid);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setRemoving(false);
      }
    },
    [user?.uid]
  );

  return { removeMember, removing, error };
}

