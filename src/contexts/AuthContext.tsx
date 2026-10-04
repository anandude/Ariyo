
import React, { createContext, useContext, useEffect, useRef } from 'react';
import type { User, Session } from '@neondatabase/auth/types';
import { authClient } from '@/integrations/neon/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Reactive session source from the Better Auth React adapter.
  // useSession() fetches on mount and re-renders on sign-in/sign-out.
  const { data: sessionData, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const user = sessionData?.user ?? null;
  const session = sessionData?.session ?? null;
  const loading = isPending;

  // Preserve the old SIGNED_IN → navigate('/app') behavior: redirect only on
  // a fresh null → signed-in transition, not on initial session resolution.
  const prevUserId = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (isPending) return;
    const currentId = user?.id ?? null;
    if (prevUserId.current === undefined) {
      prevUserId.current = currentId;
      return;
    }
    if (currentId !== null && prevUserId.current === null) {
      navigate('/app');
    }
    prevUserId.current = currentId;
  }, [user, isPending, navigate]);

  const signUp = async (email: string, password: string) => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split('@')[0],
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: window.location.origin + '/app',
    });
    return { error };
  };

  const signOut = async () => {
    await authClient.signOut();
    navigate('/');
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
