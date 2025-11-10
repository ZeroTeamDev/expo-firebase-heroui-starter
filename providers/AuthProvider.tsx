import { getFirebaseApp, getAuthInstance } from "@/integrations/firebase.client";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionStore } from "@/stores/permissionStore";
import { useConfigStore } from "@/stores/configStore";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create AuthContext to provide the user data
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const { user, loading, setUser, setLoading } = useAuthStore();
  const loadPermissions = usePermissionStore((state) => state.loadPermissions);
  const resetPermissions = usePermissionStore((state) => state.reset);
  const initializeConfig = useConfigStore((state) => state.initialize);
  const subscribeConfig = useConfigStore((state) => state.subscribe);

  useEffect(() => {
    // Initialize global config
    initializeConfig();
    const unsubscribeConfig = subscribeConfig();

    // Ensure Firebase app and Auth are initialized before subscribing
    getFirebaseApp();

    const authInstance = getAuthInstance();
    if (!authInstance) {
      // Auth not ready; mark not loading to allow auth screens
      setLoading(false);
      return () => {
        unsubscribeConfig();
      };
    }

    const unsubscribe = onAuthStateChanged(authInstance, async (nextUser) => {
      if (__DEV__) {
        console.log('[AuthProvider] onAuthStateChanged:', !!nextUser, nextUser?.email);
      }
      setUser(nextUser);
      
      // Load user permissions if authenticated
      if (nextUser?.uid) {
        try {
          // Check if user profile exists, create if not
          const { getUserProfile, createUser } = await import('@/services/users/user.service');
          const profile = await getUserProfile(nextUser.uid);
          
          if (!profile) {
            // Create user profile if it doesn't exist
            try {
              await createUser(nextUser.uid, {
                email: nextUser.email || '',
                displayName: nextUser.displayName || nextUser.email?.split('@')[0] || 'User',
              });
            } catch (createError) {
              if (__DEV__) {
                console.warn('[AuthProvider] Failed to create user profile:', createError);
              }
            }
          }
          
          await loadPermissions(nextUser.uid);
        } catch (error) {
          if (__DEV__) {
            console.warn('[AuthProvider] Failed to load permissions:', error);
          }
        }
      } else {
        // Reset permissions when user logs out
        resetPermissions();
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribeConfig();
    };
  }, [setUser, setLoading, loadPermissions, resetPermissions, initializeConfig, subscribeConfig]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
export { useAuth };
