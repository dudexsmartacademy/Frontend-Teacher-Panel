import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService, type AuthUser, type TeacherSignUpData } from '../services/authService';
import { teacherService, type TeacherAssignmentItem } from '../services/teacherService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  assignments: TeacherAssignmentItem[];
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  sendOtp: (email: string) => Promise<{ success: boolean; message: string | null; error: string | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  signUp: (data: TeacherSignUpData) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [assignments, setAssignments] = useState<TeacherAssignmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const { data: assignData } = await teacherService.getAssignments();
        setAssignments(assignData);
      }
    } catch (err) {
      console.error('Error initializing auth:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();

    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            await loadUserData();
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setAssignments([]);
          }
        }
      );

      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user: authUser, error } = await authService.signInWithEmail(email, password);
    if (error) {
      return { error };
    }
    setUser(authUser);
    if (authUser) {
      const { data: assignData } = await teacherService.getAssignments();
      setAssignments(assignData);
    }
    return { error: null };
  };

  const sendOtp = async (email: string) => {
    return await authService.sendOtp(email);
  };

  const verifyOtp = async (email: string, token: string) => {
    const { user: authUser, error } = await authService.verifyOtp(email, token);
    if (error) {
      return { error };
    }
    setUser(authUser);
    if (authUser) {
      const { data: assignData } = await teacherService.getAssignments();
      setAssignments(assignData);
    }
    return { error: null };
  };

  const signUp = async (data: TeacherSignUpData) => {
    const { user: authUser, error } = await authService.signUpWithEmail(data);
    if (error) {
      return { error };
    }
    setUser(authUser);
    if (authUser) {
      const { data: assignData } = await teacherService.getAssignments();
      setAssignments(assignData);
    }
    return { error: null };
  };

  const signInWithGoogle = async () => {
    const { user: authUser, error } = await authService.signInWithGoogle();
    if (error) {
      return { error };
    }
    if (authUser) {
      setUser(authUser);
      const { data: assignData } = await teacherService.getAssignments();
      setAssignments(assignData);
    }
    return { error: null };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setAssignments([]);
  };

  const refreshProfile = async () => {
    await loadUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        assignments,
        signIn,
        sendOtp,
        verifyOtp,
        signUp,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
