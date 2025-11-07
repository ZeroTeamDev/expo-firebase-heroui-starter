import { getFirebaseApp, getAuthInstance } from "@/integrations/firebase.client";
import { useAuthStore } from "@/stores/authStore";
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

  useEffect(() => {
    // Ensure Firebase app and Auth are initialized before subscribing
    getFirebaseApp();

    const authInstance = getAuthInstance();
    if (!authInstance) {
      // Auth not ready; mark not loading to allow auth screens
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(authInstance, (nextUser) => {
      if (__DEV__) {
        console.log('[AuthProvider] onAuthStateChanged:', !!nextUser, nextUser?.email);
      }
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

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
