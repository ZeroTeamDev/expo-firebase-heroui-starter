/**
 * Database Example Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * Demonstrates all database operations with examples
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { Card, useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { FormInput } from '@/components/forms/FormInput';
import { FormButton } from '@/components/forms/FormButton';
import { Spinner } from '@/components/feedback/Spinner';
import { EmptyState } from '@/components/data/EmptyState';
import { ErrorState } from '@/components/data/ErrorState';
import { useDocument, useCollection, useMutation, useBatch } from '@/hooks/use-firestore';
import { isFirestoreInitialized } from '@/services/firebase/database';

interface User {
  id?: string;
  name: string;
  email: string;
  age: number;
  createdAt?: number;
}

export default function DatabaseExampleScreen() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [userId, setUserId] = useState('user123');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAge, setUserAge] = useState('');
  const isInitialized = isFirestoreInitialized();

  // Example 1: Read a single document
  const { data: userData, loading: userLoading, error: userError } = useDocument<User>(
    userId ? `users/${userId}` : null,
    { subscribe: true } // Real-time updates
  );

  // Example 2: Read a collection
  const { data: users, loading: usersLoading, error: usersError } = useCollection<User>(
    'users',
    {
      subscribe: true, // Real-time updates
      filters: {
        orderBy: [['createdAt', 'desc']],
        limit: 10,
      },
    }
  );

  // Example 3: Mutation operations
  const { create, update, delete: deleteUser, loading: mutationLoading } = useMutation<User>(
    userId ? `users/${userId}` : null,
    {
      onSuccess: () => {
        Alert.alert('Success', 'Operation completed successfully');
      },
      onError: (error) => {
        Alert.alert('Error', error.message);
      },
    }
  );

  // Example 4: Batch operations
  const { execute: executeBatch, loading: batchLoading } = useBatch();

  const handleCreateUser = async () => {
    if (!userName || !userEmail || !userAge) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newUser: User = {
      name: userName,
      email: userEmail,
      age: parseInt(userAge, 10),
      createdAt: Date.now(),
    };

    // Create with auto-generated ID
    const id = await create(newUser, true);
    if (id) {
      setUserId(id);
      setUserName('');
      setUserEmail('');
      setUserAge('');
    }
  };

  const handleUpdateUser = async () => {
    if (!userId) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    const updates: Partial<User> = {};
    if (userName) updates.name = userName;
    if (userEmail) updates.email = userEmail;
    if (userAge) updates.age = parseInt(userAge, 10);

    if (Object.keys(updates).length === 0) {
      Alert.alert('Error', 'Please enter at least one field to update');
      return;
    }

    await update(updates);
  };

  const handleDeleteUser = async () => {
    if (!userId) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteUser();
          },
        },
      ]
    );
  };

  const handleBatchOperation = async () => {
    await executeBatch((batch) => {
      // Create multiple users in a batch
      batch.set('users/batch1', {
        name: 'Batch User 1',
        email: 'batch1@example.com',
        age: 25,
        createdAt: Date.now(),
      });
      batch.set('users/batch2', {
        name: 'Batch User 2',
        email: 'batch2@example.com',
        age: 30,
        createdAt: Date.now(),
      });
      batch.update('users/batch1', { age: 26 });
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Database Examples" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Firebase Initialization Warning */}
        {!isInitialized && (
          <Card className="mb-4 rounded-xl overflow-hidden border-2" style={{ borderColor: colors.warning }}>
            <Card.Body className="p-4">
              <Text style={[styles.title, { color: colors.warning }]}>
                ⚠️ Database Not Available
              </Text>
              <Text style={[styles.dataText, { color: colors.foreground, marginTop: 8 }]}>
                Firestore is not initialized. Please configure Firebase in your native code (iOS/Android) to use database features.
              </Text>
              <Text style={[styles.dataText, { color: colors.mutedForeground, marginTop: 8, fontSize: 12 }]}>
                See docs/GOOGLE_SERVICE_INFO_SETUP.md for setup instructions.
              </Text>
            </Card.Body>
          </Card>
        )}
        
        {/* Example 1: Read Document */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>
              Example 1: Read Document (Real-time)
            </Text>
          <FormInput
            placeholder="User ID (e.g., user123)"
            value={userId}
            onChangeText={setUserId}
            containerStyle={styles.inputContainer}
          />
          {userLoading && <Spinner size="small" />}
          {userError && <ErrorState error={userError} style={styles.errorContainer} />}
          {!userLoading && !userError && !userData && (
            <EmptyState title="No user found" message="Enter a user ID to load data" />
          )}
          {userData && (
            <View style={[styles.dataContainer, { backgroundColor: colors.muted }]}>
              <Text style={[styles.dataText, { color: colors.foreground }]}>
                Name: {userData.name}
              </Text>
              <Text style={[styles.dataText, { color: colors.foreground }]}>
                Email: {userData.email}
              </Text>
              <Text style={[styles.dataText, { color: colors.foreground }]}>
                Age: {userData.age}
              </Text>
            </View>
          )}
          </Card.Body>
        </Card>

        {/* Example 2: Read Collection */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>
              Example 2: Read Collection (Real-time)
            </Text>
          {usersLoading && <Spinner size="small" />}
          {usersError && <ErrorState error={usersError} style={styles.errorContainer} />}
          {!usersLoading && !usersError && users.length === 0 && (
            <EmptyState title="No users found" message="Create a user to see it here" />
          )}
          {users && users.length > 0 && (
            <View style={[styles.dataContainer, { backgroundColor: colors.muted }]}>
              <Text style={[styles.dataText, { color: colors.foreground }]}>
                Total Users: {users.length}
              </Text>
              {users.slice(0, 5).map((user, index) => (
                <Text key={index} style={[styles.dataText, { color: colors.foreground }]}>
                  {user.name} ({user.email})
                </Text>
              ))}
            </View>
          )}
          </Card.Body>
        </Card>

        {/* Example 3: Create/Update/Delete */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>
              Example 3: Create/Update/Delete
            </Text>
          <FormInput
            placeholder="Name"
            value={userName}
            onChangeText={setUserName}
            containerStyle={styles.inputContainer}
          />
          <FormInput
            placeholder="Email"
            value={userEmail}
            onChangeText={setUserEmail}
            keyboardType="email-address"
            containerStyle={styles.inputContainer}
          />
          <FormInput
            placeholder="Age"
            value={userAge}
            onChangeText={setUserAge}
            keyboardType="numeric"
            containerStyle={styles.inputContainer}
          />
          <View style={styles.buttonRow}>
            <FormButton
              title="Create"
              onPress={handleCreateUser}
              loading={mutationLoading}
              variant="primary"
              style={styles.button}
            />
            <FormButton
              title="Update"
              onPress={handleUpdateUser}
              loading={mutationLoading}
              variant="secondary"
              style={styles.button}
            />
            <FormButton
              title="Delete"
              onPress={handleDeleteUser}
              loading={mutationLoading}
              variant="danger"
              style={styles.button}
            />
          </View>
          </Card.Body>
        </Card>

        {/* Example 4: Batch Operations */}
        <Card className="mb-4 rounded-xl overflow-hidden">
          <Card.Body className="p-4">
            <Text style={[styles.title, { color: colors.foreground }]}>
              Example 4: Batch Operations
            </Text>
            <FormButton
              title={batchLoading ? 'Processing...' : 'Execute Batch'}
              onPress={handleBatchOperation}
              loading={batchLoading}
              variant="primary"
              fullWidth
            />
          </Card.Body>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
  errorContainer: {
    padding: 16,
  },
  dataContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  dataText: {
    marginBottom: 4,
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
});

