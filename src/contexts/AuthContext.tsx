import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// 🔧 DEVELOPMENT MODE - Set to true to use mock sign-in (no backend calls)
const USE_MOCK_AUTH = true;

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (phone: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const token = localStorage.getItem('session_token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 🔧 MOCK MODE: Just use localStorage data
      if (USE_MOCK_AUTH) {
        console.log('🔧 MOCK MODE: Using localStorage session');
        setUser(JSON.parse(userData));
        setLoading(false);
        return;
      }

      // Real backend validation
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/auth/user`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('session_token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(phone: string) {
    try {
      // Format phone number to E.164 format if needed
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      // 🔧 MOCK MODE: Create fake session locally
      if (USE_MOCK_AUTH) {
        console.log('🔧 MOCK MODE: Creating fake session for phone:', formattedPhone);
        
        const mockUser = {
          id: `mock-user-${Date.now()}`,
          phone: formattedPhone,
        };
        
        const mockToken = `mock-token-${Date.now()}`;
        
        localStorage.setItem('session_token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        console.log('✅ MOCK MODE: User signed in successfully:', mockUser);
        return { success: true };
      }

      // Real backend sign-in
      console.log('🌐 Calling /auth/signin API with phone:', formattedPhone);

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/auth/signin`;
      console.log('🔗 URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      console.log('📡 Response status:', response.status);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        console.error('❌ Error response:', data);
        return { success: false, error: data.error || 'Failed to sign in' };
      }

      // Save session token and user data
      if (data.access_token && data.user) {
        console.log('💾 Saving session token and user data to localStorage');
        localStorage.setItem('session_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        console.log('✅ User signed in successfully:', data.user);
      }

      return { success: true };
    } catch (error: any) {
      console.error('❌ Exception in signIn:', error);
      return { success: false, error: error.message || 'Failed to sign in' };
    }
  }

  async function signOut() {
    try {
      const token = localStorage.getItem('session_token');
      if (token) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/auth/signout`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
      }
      
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear local state even if request fails
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
