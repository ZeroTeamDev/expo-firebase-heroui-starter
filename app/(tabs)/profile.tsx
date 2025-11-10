/**
 * Profile Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * User profile screen with editable information, Firestore integration, and logout functionality
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormButton } from '@/components/forms/FormButton';
import { FormDatePicker } from '@/components/forms/FormDatePicker';
import { FormSelect } from '@/components/forms/FormSelect';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/providers/AuthProvider';
import { useTabBarPadding } from '@/hooks/use-tab-bar-padding';
import { getAuthInstance, logout } from '@/integrations/firebase.client';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/components/feedback/Toast';
import { useDocument, useMutation } from '@/hooks/use-firestore';
import { router } from 'expo-router';

// User profile interface for Firestore
interface UserProfile {
  displayName?: string;
  bio?: string;
  email: string;
  photoURL?: string;
  dateOfBirth?: number | null; // Timestamp in milliseconds
  gender?: string | null;
  address?: string;
  createdAt: number;
  updatedAt: number;
}

export default function ProfileScreen() {
  const { colors, theme } = useTheme();
  const { user, setUser } = useAuthStore();
  const { loading: authLoading } = useAuth();
  const bottomPadding = useTabBarPadding();
  const { showToast } = useToast();
  const isDark = theme === 'dark';

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [originalBio, setOriginalBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [originalDateOfBirth, setOriginalDateOfBirth] = useState<Date | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [originalGender, setOriginalGender] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [originalAddress, setOriginalAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const initialLoadRef = useRef(true);

  // Gender options
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  // Get user profile document path
  const userProfilePath = user ? `users/${user.uid}` : null;

  // Load user profile from Firestore
  const { data: userProfile, loading: profileLoading, error: profileError } = useDocument<UserProfile>(
    userProfilePath,
    { subscribe: true, enabled: !!user }
  );

  // Mutation hook for updating user profile
  const { update: updateProfileDoc, create: createProfileDoc, loading: mutationLoading } = useMutation<UserProfile>(
    userProfilePath,
    {
      onSuccess: () => {
        if (__DEV__) {
          console.log('[Profile] Profile updated successfully in Firestore');
        }
      },
      onError: (error) => {
        console.error('[Profile] Error updating profile in Firestore:', error);
        // Error handling is done in the save function
      },
    }
  );

  // Initialize form with user data from Auth and Firestore
  useEffect(() => {
    if (user && !authLoading) {
      // Set display name from Firebase Auth
      setDisplayName(user.displayName || '');

      // Set data from Firestore if available
      if (userProfile) {
        setBio(userProfile.bio || '');
        setOriginalBio(userProfile.bio || '');
        
        // Set date of birth
        if (userProfile.dateOfBirth) {
          const dob = new Date(userProfile.dateOfBirth);
          setDateOfBirth(dob);
          setOriginalDateOfBirth(dob);
        } else {
          setDateOfBirth(null);
          setOriginalDateOfBirth(null);
        }
        
        // Set gender
        setGender(userProfile.gender || null);
        setOriginalGender(userProfile.gender || null);
        
        // Set address
        setAddress(userProfile.address || '');
        setOriginalAddress(userProfile.address || '');
      } else if (!profileLoading && initialLoadRef.current) {
        // Create user document if it doesn't exist
        initialLoadRef.current = false;
        createInitialUserDocument();
      }
    }
  }, [user, userProfile, authLoading, profileLoading, createInitialUserDocument]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
    }
  }, [authLoading, user]);

  // Create initial user document in Firestore if it doesn't exist
  const createInitialUserDocument = useCallback(async () => {
    if (!user || userProfile) return;

    try {
      const now = Date.now();
      const createdAt = user.metadata?.creationTime 
        ? new Date(user.metadata.creationTime).getTime() 
        : now;
      
      const initialProfile: UserProfile = {
        displayName: user.displayName || '',
        bio: '',
        email: user.email || '',
        dateOfBirth: null,
        gender: null,
        address: '',
        ...(user.photoURL && { photoURL: user.photoURL }),
        createdAt: createdAt,
        updatedAt: now,
      };

      await createProfileDoc(initialProfile, false);
      if (__DEV__) {
        console.log('[Profile] Created initial user document in Firestore');
      }
    } catch (error) {
      // Silently handle error - document might already exist or Firestore not available
      const err = error as Error;
      if (err.message && !err.message.includes('Database is not available')) {
        // Document might have been created by another process, which is fine
        if (__DEV__) {
          console.log('[Profile] Could not create initial user document (might already exist):', err.message);
        }
      }
      // Firestore not available is okay - will be handled gracefully
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get member since date
  const getMemberSince = () => {
    if (user?.metadata?.creationTime) {
      const date = new Date(user.metadata.creationTime);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return 'Unknown';
  };

  // Check if email is verified
  const isEmailVerified = user?.emailVerified ?? false;

  const handleEdit = () => {
    setIsEditing(true);
    // Store original values for cancel
    setOriginalBio(bio);
    setOriginalDateOfBirth(dateOfBirth);
    setOriginalGender(gender);
    setOriginalAddress(address);
  };

  const handleCancel = () => {
    // Reset to original values
    setDisplayName(user?.displayName || '');
    setBio(originalBio);
    setDateOfBirth(originalDateOfBirth);
    setGender(originalGender);
    setAddress(originalAddress);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) {
      showToast({
        title: 'Error',
        message: 'User not found',
        variant: 'error',
      });
      return;
    }

    setIsSaving(true);

    try {
      const authInstance = getAuthInstance();
      if (!authInstance || !authInstance.currentUser) {
        throw new Error('Auth instance not available');
      }

      const trimmedDisplayName = displayName.trim() || null;
      const trimmedBio = bio.trim() || '';

      // Update display name in Firebase Auth if changed
      if (trimmedDisplayName !== user.displayName) {
        await updateProfile(authInstance.currentUser, {
          displayName: trimmedDisplayName,
        });

        // Update local user state
        setUser({
          ...user,
          displayName: trimmedDisplayName,
        });
      }

      // Update Firestore user document
      try {
        const now = Date.now();
        const updateData: Partial<UserProfile> = {
          displayName: trimmedDisplayName || '',
          bio: trimmedBio,
          dateOfBirth: dateOfBirth ? dateOfBirth.getTime() : null,
          gender: gender || null,
          address: address.trim() || '',
          updatedAt: now,
        };

        // Try to update existing document first
        if (userProfile) {
          await updateProfileDoc(updateData);
        } else {
          // Document doesn't exist, create it
          // Use setDoc which will create the document if it doesn't exist
          const initialProfile: UserProfile = {
            displayName: trimmedDisplayName || '',
            bio: trimmedBio,
            email: user.email || '',
            dateOfBirth: dateOfBirth ? dateOfBirth.getTime() : null,
            gender: gender || null,
            address: address.trim() || '',
            ...(user.photoURL && { photoURL: user.photoURL }),
            createdAt: user.metadata?.creationTime ? new Date(user.metadata.creationTime).getTime() : now,
            updatedAt: now,
          };
          try {
            await createProfileDoc(initialProfile, false);
          } catch (createError) {
            // If create fails (e.g., document was created between check and create),
            // try to update instead
            const error = createError as Error;
            if (error.message && !error.message.includes('Database is not available')) {
              // Document might exist now, try to update
              try {
                await updateProfileDoc(updateData);
              } catch (updateError) {
                // If update also fails, throw the original error
                throw createError;
              }
            } else {
              throw createError;
            }
          }
        }

        // Update local state
        setBio(trimmedBio);
        setOriginalBio(trimmedBio);
        setOriginalDateOfBirth(dateOfBirth);
        setOriginalGender(gender);
        setOriginalAddress(address.trim());
      } catch (firestoreError) {
        // Handle Firestore errors gracefully
        const error = firestoreError as Error;
        if (error.message && error.message.includes('Database is not available')) {
          // Firestore not configured - this is okay, just show a warning
          if (__DEV__) {
            console.log('[Profile] Firestore not available, skipping database update');
          }
          // Don't throw error - allow the save to succeed for Auth update
        } else {
          // Other Firestore errors - throw to show error message
          throw new Error(`Failed to save profile: ${error.message}`);
        }
      }

      setIsEditing(false);
      showToast({
        title: 'Success',
        message: 'Profile updated successfully',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
              showToast({
                title: 'Logged Out',
                message: 'You have been successfully logged out',
                variant: 'success',
              });
              router.replace('/auth/login');
            } catch (error) {
              console.error('Logout error:', error);
              showToast({
                title: 'Error',
                message: 'Failed to logout. Please try again.',
                variant: 'error',
              });
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Show loading state during auth check or initial profile load
  const isLoading = authLoading || (profileLoading && !userProfile && user);

  // Show loading screen
  if (authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground, marginTop: 16 }]}>
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  // Redirect to login if not authenticated (this will happen via useEffect)
  // But show a message while redirecting
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Profile" />
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.mutedForeground }}>Redirecting to login...</Text>
        </View>
      </View>
    );
  }

  const avatarColor = colors.accent;
  const surfaceColor = colors.surface1 || (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)');
  const dividerColor = colors.border || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');

  const renderSection = (title: string, children: React.ReactNode) => {
    return (
      <View style={styles.sectionContainer}>
        <View style={[styles.section, { backgroundColor: surfaceColor }]}>
          {title && (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                {title}
              </Text>
            </View>
          )}
          <View style={styles.sectionContent}>
            {children}
          </View>
        </View>
      </View>
    );
  };

  const renderInfoItem = (
    label: string,
    value: string | React.ReactNode,
    showDivider: boolean = true
  ) => {
    return (
      <>
        <View style={styles.infoItemContainer}>
          <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
            {label}
          </Text>
          {typeof value === 'string' ? (
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {value}
            </Text>
          ) : (
            value
          )}
        </View>
        {showDivider && (
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        )}
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Profile" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeaderContainer}>
          <View style={[styles.profileHeader, { backgroundColor: surfaceColor }]}>
            {/* Avatar */}
            <View
              style={[
                styles.avatar,
                {
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: avatarColor,
                  marginBottom: 16,
                },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  { color: colors.accentForeground, fontSize: 36 },
                ]}
              >
                {getUserInitials()}
              </Text>
            </View>

            {/* Display Name (editable when editing) */}
            {isEditing ? (
              <View style={styles.editNameContainer}>
                <FormInput
                  label="Display Name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Enter your name"
                  style={{ width: '100%' }}
                  maxLength={50}
                />
              </View>
            ) : (
              <Text
                style={[styles.displayName, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {user.displayName || 'No name set'}
              </Text>
            )}

            {/* Email (read-only) */}
            <Text
              style={[styles.email, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {user.email}
            </Text>

            {/* Edit Button */}
            {!isEditing && (
              <FormButton
                title="Edit Profile"
                onPress={handleEdit}
                variant="outline"
                size="small"
                style={{ marginTop: 20, minWidth: 120 }}
              />
            )}
          </View>
        </View>

        {/* Profile Information */}
        {renderSection('Profile Information', (
          <>
            {/* Bio */}
            {isEditing ? (
              <View style={styles.formFieldContainer}>
                <FormTextarea
                  label="Bio"
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself"
                  minRows={3}
                  maxRows={6}
                  maxLength={200}
                  showCharacterCount
                />
              </View>
            ) : (
              <>
                {renderInfoItem(
                  'Bio',
                  bio || 'No bio set',
                  true
                )}
              </>
            )}

            {/* Date of Birth */}
            {isEditing ? (
              <View style={styles.formFieldContainer}>
                <FormDatePicker
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  mode="date"
                  placeholder="Select your date of birth"
                  maximumDate={new Date()} // Cannot select future dates
                  helperText="Select your date of birth"
                />
              </View>
            ) : (
              <>
                {renderInfoItem(
                  'Date of Birth',
                  dateOfBirth
                    ? dateOfBirth.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Not set',
                  true
                )}
              </>
            )}

            {/* Gender */}
            {isEditing ? (
              <View style={styles.formFieldContainer}>
                <FormSelect
                  label="Gender"
                  value={gender}
                  onChange={(value) => setGender(value as string)}
                  options={genderOptions}
                  placeholder="Select gender"
                  searchable={false}
                />
              </View>
            ) : (
              <>
                {renderInfoItem(
                  'Gender',
                  gender
                    ? genderOptions.find((opt) => opt.value === gender)?.label || gender
                    : 'Not set',
                  true
                )}
              </>
            )}

            {/* Address */}
            {isEditing ? (
              <View style={styles.formFieldContainer}>
                <FormTextarea
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  minRows={2}
                  maxRows={4}
                  maxLength={200}
                  showCharacterCount
                />
              </View>
            ) : (
              <>
                {renderInfoItem(
                  'Address',
                  address || 'Not set',
                  false
                )}
              </>
            )}

            {/* Save/Cancel Buttons */}
            {isEditing && (
              <View style={styles.buttonRow}>
                <FormButton
                  title="Cancel"
                  onPress={handleCancel}
                  variant="secondary"
                  style={{ flex: 1, marginRight: 8 }}
                  disabled={isSaving}
                />
                <FormButton
                  title="Save"
                  onPress={handleSave}
                  variant="primary"
                  style={{ flex: 1, marginLeft: 8 }}
                  loading={isSaving}
                  disabled={isSaving}
                />
              </View>
            )}
          </>
        ))}

        {/* Account Info */}
        {renderSection('Account Information', (
          <>
            {/* Member Since */}
            {renderInfoItem(
              'Member Since',
              getMemberSince(),
              true
            )}

            {/* Email Verification Status */}
            {renderInfoItem(
              'Email Status',
              <View style={styles.statusRow}>
                <Text
                  style={[
                    styles.statusBadge,
                    {
                      color: isEmailVerified ? colors.success : colors.warning,
                      backgroundColor: isEmailVerified
                        ? `${colors.success}20`
                        : `${colors.warning}20`,
                    },
                  ]}
                >
                  {isEmailVerified ? 'Verified' : 'Unverified'}
                </Text>
              </View>,
              true
            )}

            {/* Account Status */}
            {renderInfoItem(
              'Account Status',
              <View style={styles.statusRow}>
                <Text
                  style={[
                    styles.statusBadge,
                    {
                      color: colors.success,
                      backgroundColor: `${colors.success}20`,
                    },
                  ]}
                >
                  Active
                </Text>
              </View>,
              false
            )}
          </>
        ))}

        {/* Logout Section */}
        <View style={styles.logoutContainer}>
          <View style={[styles.logoutSection, { backgroundColor: surfaceColor }]}>
            <FormButton
              title={isLoggingOut ? 'Logging out...' : 'Logout'}
              onPress={handleLogout}
              variant="danger"
              style={{ width: '100%' }}
              disabled={isLoggingOut || isSaving}
              loading={isLoggingOut}
            />
          </View>
        </View>

        {/* Firestore Error Warning (if applicable) */}
        {profileError && profileError.message.includes('Database is not available') && (
          <View style={styles.warningContainer}>
            <View style={[styles.warningSection, { backgroundColor: surfaceColor }]}>
              <Text style={[styles.warningText, { color: colors.warning }]}>
                Note: Database is not available. Profile data will be saved locally only.
              </Text>
            </View>
          </View>
        )}
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  profileHeaderContainer: {
    marginBottom: 24,
  },
  profileHeader: {
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '600',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  editNameContainer: {
    width: '100%',
    marginBottom: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  section: {
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  sectionContent: {
    paddingVertical: 4,
  },
  formFieldContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'right',
    marginLeft: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    marginRight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  statusRow: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
  },
  logoutContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  logoutSection: {
    borderRadius: 14,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  warningContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  warningSection: {
    borderRadius: 14,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});

