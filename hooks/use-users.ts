/**
 * User Hooks
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * React hooks for user management operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  listUsers as listUsersService,
  updateUserProfile,
  updateUserRole,
  assignUserToGroup,
  removeUserFromGroup,
  getUserFileStats,
  type UpdateUserData,
  type UserStats,
} from '@/services/users/user.service';
import { subscribeToDocument, subscribeToCollection } from '@/services/firebase/database';
import type { UserProfile } from '@/services/permissions/permission.service';
import type { UserRole } from '@/utils/permissions';
// Note: Filters are handled client-side in the component, not passed to subscription

/**
 * Get all users with real-time updates
 */
export function useUsers() {
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<(UserProfile & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe to all users - filtering will be done client-side in the component
    const unsubscribe = subscribeToCollection<UserProfile & { id: string }>(
      'users',
      (userList, err) => {
        if (err) {
          setError(err);
          setLoading(false);
          return;
        }

        // Ensure each user has an id field
        const usersWithId = userList.map((u) => ({
          ...u,
          id: (u as any).id || '',
        }));

        setUsers(usersWithId);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return { users, loading, error };
}

/**
 * Get specific user
 */
export function useUser(userId: string | null) {
  const [user, setUser] = useState<(UserProfile & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToDocument<UserProfile & { id: string }>(
      `users/${userId}`,
      (userData, err) => {
        if (err) {
          setError(err);
          setLoading(false);
          return;
        }

        if (userData) {
          userData.id = userId;
        }

        setUser(userData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { user, loading, error };
}

/**
 * Update user profile hook
 */
export function useUpdateUser() {
  const user = useAuthStore((state) => state.user);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (userId: string, updates: UpdateUserData) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setUpdating(true);
      setError(null);

      try {
        await updateUserProfile(userId, updates);
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
 * Update user role hook
 */
export function useUpdateUserRole() {
  const user = useAuthStore((state) => state.user);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateRole = useCallback(
    async (userId: string, newRole: UserRole) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setUpdating(true);
      setError(null);

      try {
        await updateUserRole(userId, newRole, user.uid);
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

  return { updateRole, updating, error };
}

/**
 * Assign user to group hook
 */
export function useAssignUserToGroup() {
  const user = useAuthStore((state) => state.user);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const assign = useCallback(
    async (userId: string, groupId: string) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setAssigning(true);
      setError(null);

      try {
        await assignUserToGroup(userId, groupId, user.uid);
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setAssigning(false);
      }
    },
    [user?.uid]
  );

  return { assign, assigning, error };
}

/**
 * Remove user from group hook
 */
export function useRemoveUserFromGroup() {
  const user = useAuthStore((state) => state.user);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(
    async (userId: string) => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      setRemoving(true);
      setError(null);

      try {
        await removeUserFromGroup(userId, user.uid);
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

  return { remove, removing, error };
}

/**
 * Get user file statistics hook
 */
export function useUserFileStats(userId: string | null) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getUserFileStats(userId)
      .then((userStats) => {
        setStats(userStats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err as Error);
        setLoading(false);
      });
  }, [userId]);

  return { stats, loading, error };
}

