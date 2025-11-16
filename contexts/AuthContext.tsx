"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// 🔧 DEVELOPMENT MODE - Set to true to use mock sign-in (no backend calls)
const DEV_MODE = true;

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        if (DEV_MODE) {
          // Mock user in development mode
          const mockUser: User = {
            id: 'dev-user-123',
            email: 'dev@example.com',
            name: 'Development User'
          };
          setUser(mockUser);
        } else {
          // In production, check for actual Supabase session
          const { createClient } = await import('../utils/supabase/client');
          const supabase = createClient();

          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name,
              avatar: session.user.user_metadata?.avatar_url
            });
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (DEV_MODE) {
        // Mock sign-in
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser: User = {
          id: 'dev-user-123',
          email,
          name: 'Development User'
        };
        setUser(mockUser);
        return true;
      }

      const { createClient } = await import('../utils/supabase/client');
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return false;
      }

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name,
          avatar: authUser.user_metadata?.avatar_url
        });
      }

      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (DEV_MODE) {
        // Mock sign-up
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser: User = {
          id: 'dev-user-123',
          email,
          name: name || 'Development User'
        };
        setUser(mockUser);
        return true;
      }

      const { createClient } = await import('../utils/supabase/client');
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (!DEV_MODE) {
        const { createClient } = await import('../utils/supabase/client');
        const supabase = createClient();
        await supabase.auth.signOut();
      }

      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (DEV_MODE) {
        // Mock Google sign-in
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser: User = {
          id: 'google-user-123',
          email: 'google@example.com',
          name: 'Google User'
        };
        setUser(mockUser);
        return true;
      }

      // In production, implement actual Google OAuth
      return false;
    } catch (error) {
      console.error('Google sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}