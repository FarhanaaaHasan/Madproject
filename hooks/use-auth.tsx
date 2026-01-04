import { auth } from '@/config/firebase';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

type User = { uid: string; email: string | null; name?: string | null };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signUp: (params: { email: string; password: string; name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    console.log('[use-auth] Setting up auth listener');
    const unsubscribe = onAuthStateChanged(
      auth, 
      (firebaseUser) => {
        console.log('[use-auth] Auth state changed:', firebaseUser ? 'User logged in' : 'No user');
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('[use-auth] Auth state error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async ({ email, password, name }: { email: string; password: string; name?: string }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile with display name if provided
      if (name) {
        await updateProfile(firebaseUser, { displayName: name });
      }

      // Update local state
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name || null,
      });
      console.log('[use-auth] User registered:', { email, name });
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
