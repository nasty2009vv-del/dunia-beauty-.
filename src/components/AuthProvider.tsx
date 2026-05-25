'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AuthContextProps {
  user: UserProfile | null;
  isAdmin: boolean;
  adminEmails: string[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addAdminEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const DEFAULT_ADMIN_EMAILS = [
  'admin@dunia.com',
  'admin@dunia.beauty',
  'ahmad@dunia.com'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmails, setAdminEmails] = useState<string[]>(DEFAULT_ADMIN_EMAILS);
  const [loading, setLoading] = useState(true);

  // Sync Admin Emails from Supabase if available
  const syncAdminEmails = async () => {
    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('email');

        if (error) {
          // If the table doesn't exist, we fallback silently to defaults
          console.warn("Could not query admins table, using defaults:", error.message);
          return DEFAULT_ADMIN_EMAILS;
        }

        if (data && data.length > 0) {
          const list = data.map((row: any) => row.email.toLowerCase().trim());
          setAdminEmails(list);
          return list;
        } else {
          // Seed initial admins if empty
          const seedRows = DEFAULT_ADMIN_EMAILS.map(email => ({ email }));
          const { error: seedError } = await supabase
            .from('admins')
            .insert(seedRows);
          if (!seedError) {
            setAdminEmails(DEFAULT_ADMIN_EMAILS);
            return DEFAULT_ADMIN_EMAILS;
          }
        }
      } catch (error) {
        console.error("Error reading admin emails from Supabase:", error);
      }
    } else {
      // LocalStorage Sync (Mock Mode)
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('dunia_beauty_admins');
        if (stored) {
          try {
            const list = JSON.parse(stored);
            setAdminEmails(list);
            return list;
          } catch (e) {
            console.error("Failed to parse admin list", e);
          }
        } else {
          localStorage.setItem('dunia_beauty_admins', JSON.stringify(DEFAULT_ADMIN_EMAILS));
        }
      }
    }
    return DEFAULT_ADMIN_EMAILS;
  };

  useEffect(() => {
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      const activeAdminEmails = await syncAdminEmails();

      if (isSupabaseAvailable && supabase) {
        // Fetch active session first
        const { data: { session } } = await supabase.auth.getSession();
        const initialUser = session?.user || null;
        
        if (initialUser) {
          const profile = {
            uid: initialUser.id,
            email: initialUser.email || null,
            displayName: initialUser.email?.split('@')[0] || '',
          };
          setUser(profile);
          setIsAdmin(activeAdminEmails.includes(initialUser.email?.toLowerCase().trim() || ''));
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);

        // Listen for session updates
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
          const activeUser = session?.user || null;
          if (activeUser) {
            const profile = {
              uid: activeUser.id,
              email: activeUser.email || null,
              displayName: activeUser.email?.split('@')[0] || '',
            };
            setUser(profile);
            
            // Re-sync admin list to check admin privileges
            const latestAdmins = await syncAdminEmails();
            setIsAdmin(latestAdmins.includes(activeUser.email?.toLowerCase().trim() || ''));
          } else {
            setUser(null);
            setIsAdmin(false);
          }
          setLoading(false);
        });

        unsubscribe = () => {
          subscription.unsubscribe();
        };
      } else {
        // Mock Auth check
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('dunia_beauty_user');
          if (storedUser) {
            try {
              const profile = JSON.parse(storedUser);
              setUser(profile);
              setIsAdmin(activeAdminEmails.includes(profile.email || ''));
            } catch (e) {
              localStorage.removeItem('dunia_beauty_user');
            }
          }
        }
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const normalizedEmail = email.toLowerCase().trim();

    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Mock Auth Login
      if (typeof window !== 'undefined') {
        const usersStored = localStorage.getItem('dunia_beauty_registered_users');
        const registeredUsers = usersStored ? JSON.parse(usersStored) : {};
        
        if (!registeredUsers['admin@dunia.com']) {
          registeredUsers['admin@dunia.com'] = 'admin123';
          localStorage.setItem('dunia_beauty_registered_users', JSON.stringify(registeredUsers));
        }

        if (registeredUsers[normalizedEmail] && registeredUsers[normalizedEmail] === password) {
          const mockUser: UserProfile = {
            uid: `mock-user-${Date.now()}`,
            email: normalizedEmail,
            displayName: normalizedEmail.split('@')[0],
          };
          localStorage.setItem('dunia_beauty_user', JSON.stringify(mockUser));
          setUser(mockUser);
          setIsAdmin(adminEmails.includes(normalizedEmail));
          setLoading(false);
        } else {
          setLoading(false);
          throw new Error("Invalid email or password. (Mock tip: Use admin@dunia.com / admin123)");
        }
      }
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    const normalizedEmail = email.toLowerCase().trim();

    if (isSupabaseAvailable && supabase) {
      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
      });
      if (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Mock Auth Sign Up
      if (typeof window !== 'undefined') {
        const usersStored = localStorage.getItem('dunia_beauty_registered_users');
        const registeredUsers = usersStored ? JSON.parse(usersStored) : {};

        if (registeredUsers[normalizedEmail]) {
          setLoading(false);
          throw new Error("Email already in use.");
        }

        registeredUsers[normalizedEmail] = password;
        localStorage.setItem('dunia_beauty_registered_users', JSON.stringify(registeredUsers));

        const mockUser: UserProfile = {
          uid: `mock-user-${Date.now()}`,
          email: normalizedEmail,
          displayName: normalizedEmail.split('@')[0],
        };
        localStorage.setItem('dunia_beauty_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAdmin(adminEmails.includes(normalizedEmail));
        setLoading(false);
      }
    }
  };

  const logout = async () => {
    setLoading(true);
    if (isSupabaseAvailable && supabase) {
      await supabase.auth.signOut();
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dunia_beauty_user');
      }
      setUser(null);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  const addAdminEmail = async (email: string) => {
    const normalized = email.toLowerCase().trim();
    if (adminEmails.includes(normalized)) return;

    const updatedList = [...adminEmails, normalized];
    setAdminEmails(updatedList);

    if (isSupabaseAvailable && supabase) {
      try {
        await supabase
          .from('admins')
          .insert([{ email: normalized }]);
      } catch (error) {
        console.error("Error saving admin email to Supabase:", error);
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('dunia_beauty_admins', JSON.stringify(updatedList));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      adminEmails,
      loading,
      login,
      signup,
      logout,
      addAdminEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
