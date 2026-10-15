import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AppRole } from '../types/database.types';
import { sanitizeErrorMessage } from '../lib/errorUtils';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
  facultyId?: string;
  department?: string;
  status?: string;
  phone?: string;
  designation?: string;
}

export interface TeacherSignUpData {
  fullName: string;
  email: string;
  password: string;
  department: string;
  facultyId?: string;
  phoneNumber?: string;
  designation?: string;
}

export const authService = {
  async signInWithGoogle() {
    if (!isSupabaseConfigured) {
      console.warn('Supabase credentials not configured. Using local session mode with Google.');
      const localUser: AuthUser = {
        id: 'g-1111111-1111-1111-1111-111111111111',
        email: 'faculty.google@dudex.edu',
        fullName: 'Prof. Alex Morgan',
        role: 'teacher' as AppRole,
        facultyId: 'FAC099',
        department: 'Computer Science & Engineering',
        status: 'active',
      };
      localStorage.setItem('dudex_teacher_profile_data', JSON.stringify({
        name: localUser.fullName,
        email: localUser.email,
        facultyId: localUser.facultyId,
        department: localUser.department,
      }));
      return { user: localUser, error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return { user: null, error: sanitizeErrorMessage(error, 'Google authentication failed.') };
      }
      return { user: null, error: null };
    } catch (err: unknown) {
      return { user: null, error: sanitizeErrorMessage(err, 'Google Sign In failed.') };
    }
  },

  async sendOtp(email: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase credentials not configured. Simulating OTP send in sandbox mode.');
      return {
        success: true,
        message: 'A 6-digit verification code has been generated for demo testing: 123456',
        error: null,
      };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        return {
          success: false,
          message: null,
          error: sanitizeErrorMessage(error, 'Failed to send OTP. Please ensure this email is registered in faculty records.'),
        };
      }

      return {
        success: true,
        message: `Verification code sent successfully to ${email.trim()}. Please check your inbox.`,
        error: null,
      };
    } catch (err: unknown) {
      return {
        success: false,
        message: null,
        error: sanitizeErrorMessage(err, 'Failed to dispatch OTP verification code.'),
      };
    }
  },

  async verifyOtp(email: string, token: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase credentials not configured. Simulating OTP verification.');
      if (token.trim() === '123456' || token.trim().length === 6) {
        const localUser: AuthUser = {
          id: 'b1111111-1111-1111-1111-111111111111',
          email: email.trim() || 'teacher@test.local',
          fullName: 'Prof. Sarah Jenkins',
          role: 'teacher' as AppRole,
          facultyId: 'FAC001',
          department: 'Computer Science & Engineering',
          status: 'active',
        };
        return { user: localUser, error: null };
      }
      return { user: null, error: 'Invalid verification code. (Sandbox Demo Code: 123456)' };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: token.trim(),
        type: 'email',
      });

      if (error) {
        return { user: null, error: sanitizeErrorMessage(error, 'Invalid or expired OTP code.') };
      }

      if (!data.user) {
        return { user: null, error: 'User account not found.' };
      }

      // Verify teacher role
      const { data: roleData, error: roleError } = await (supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'teacher')
        .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

      if (roleError || !roleData) {
        await supabase.auth.signOut();
        return { user: null, error: 'Access denied. Account does not have faculty privileges.' };
      }

      // Fetch teacher profile and status
      const { data: teacherProfile, error: tpError } = await (supabase
        .from('teacher_profiles')
        .select('faculty_id, status, departments(name)')
        .eq('user_id', data.user.id)
        .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

      if (tpError || !teacherProfile) {
        await supabase.auth.signOut();
        return { user: null, error: 'Teacher profile not registered in the system.' };
      }

      if (teacherProfile.status !== 'active') {
        await supabase.auth.signOut();
        return { user: null, error: `Account access restricted. Your faculty status is ${teacherProfile.status}.` };
      }

      // Fetch base profile
      const { data: profile } = await (supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

      const deptName = (teacherProfile.departments as { name: string } | undefined)?.name || 'Computer Science & Engineering';

      // Log teacher login activity
      await supabase.from('activity_logs').insert({
        actor_id: data.user.id,
        action: 'TEACHER_LOGIN_OTP',
        entity_type: 'teacher_profiles',
        entity_id: data.user.id,
        metadata: { timestamp: new Date().toISOString() },
      });

      return {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          fullName: (profile?.full_name as string) || 'Faculty Member',
          role: 'teacher' as AppRole,
          facultyId: (teacherProfile.faculty_id as string) || 'FAC001',
          department: deptName,
          status: teacherProfile.status as string,
        },
        error: null,
      };
    } catch (err: unknown) {
      return { user: null, error: sanitizeErrorMessage(err, 'Sign in via OTP failed. Please check connection.') };
    }
  },

  async signUpWithEmail(data: TeacherSignUpData) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase credentials not configured. Simulating faculty sign up.');
      const localUser: AuthUser = {
        id: 'new-' + Math.random().toString(36).substring(2, 9),
        email: data.email,
        fullName: data.fullName,
        role: 'teacher' as AppRole,
        facultyId: data.facultyId || `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
        department: data.department || 'Computer Science & Engineering',
        status: 'active',
        phone: data.phoneNumber,
        designation: data.designation,
      };

      localStorage.setItem('dudex_teacher_profile_data', JSON.stringify({
        name: localUser.fullName,
        email: localUser.email,
        facultyId: localUser.facultyId,
        department: localUser.department,
        phone: localUser.phone,
        designation: localUser.designation,
      }));

      return { user: localUser, error: null };
    }

    try {
      const { data: authResult, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: 'teacher',
            faculty_id: data.facultyId,
            department: data.department,
          },
        },
      });

      if (error) {
        return { user: null, error: sanitizeErrorMessage(error, 'Sign up failed.') };
      }

      if (!authResult.user) {
        return { user: null, error: 'Registration failed. Please try again.' };
      }

      // Upsert profile and user role
      try {
        await supabase.from('profiles').upsert({
          id: authResult.user.id,
          full_name: data.fullName,
          email: data.email,
        });

        await supabase.from('user_roles').upsert({
          user_id: authResult.user.id,
          role: 'teacher',
        });

        await supabase.from('teacher_profiles').upsert({
          user_id: authResult.user.id,
          faculty_id: data.facultyId || `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'active',
          phone: data.phoneNumber,
          designation: data.designation,
        });
      } catch (dbErr) {
        console.warn('Could not auto-insert extra teacher profile rows:', dbErr);
      }

      const registeredUser: AuthUser = {
        id: authResult.user.id,
        email: data.email,
        fullName: data.fullName,
        role: 'teacher' as AppRole,
        facultyId: data.facultyId || 'FAC001',
        department: data.department || 'Computer Science & Engineering',
        status: 'active',
      };

      return { user: registeredUser, error: null };
    } catch (err: unknown) {
      return { user: null, error: sanitizeErrorMessage(err, 'Sign up failed. Please check network connection.') };
    }
  },
  async signInWithEmail(email: string, password: string) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase credentials not configured. Using local session mode.');
      return {
        user: {
          id: 'b1111111-1111-1111-1111-111111111111',
          email: email || 'teacher@test.local',
          fullName: 'ABC',
          role: 'teacher' as AppRole,
          facultyId: 'FAC001',
          department: 'Computer Science & Engineering',
          status: 'active',
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: sanitizeErrorMessage(error, 'Invalid email or password.') };
      }

      if (!data.user) {
        return { user: null, error: 'User account not found.' };
      }

      // Verify teacher role
      const { data: roleData, error: roleError } = await (supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'teacher')
        .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

      if (roleError || !roleData) {
        await supabase.auth.signOut();
        return { user: null, error: 'Access denied. Account does not have faculty privileges.' };
      }

      // Fetch teacher profile and status
      const { data: teacherProfile, error: tpError } = await (supabase
        .from('teacher_profiles')
        .select('faculty_id, status, departments(name)')
        .eq('user_id', data.user.id)
        .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

      if (tpError || !teacherProfile) {
        await supabase.auth.signOut();
        return { user: null, error: 'Teacher profile not registered in the system.' };
      }

      // Verify active status
      if (teacherProfile.status !== 'active') {
        await supabase.auth.signOut();
        return { user: null, error: `Account access restricted. Your faculty status is ${teacherProfile.status}. Please contact administration.` };
      }

      // Fetch base profile
      const { data: profile } = await (supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

      const deptName = (teacherProfile.departments as { name: string } | undefined)?.name || 'Computer Science & Engineering';

      // Log teacher login activity
      await supabase.from('activity_logs').insert({
        actor_id: data.user.id,
        action: 'TEACHER_LOGIN',
        entity_type: 'teacher_profiles',
        entity_id: data.user.id,
        metadata: { timestamp: new Date().toISOString() },
      });

      return {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          fullName: (profile?.full_name as string) || 'Faculty Member',
          role: 'teacher' as AppRole,
          facultyId: (teacherProfile.faculty_id as string) || 'FAC001',
          department: deptName,
          status: teacherProfile.status as string,
        },
        error: null,
      };
    } catch (err: unknown) {
      return { user: null, error: sanitizeErrorMessage(err, 'Sign in failed. Please check network connection.') };
    }
  },

  async signOut() {
    if (isSupabaseConfigured) {
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (user) {
          await supabase.from('activity_logs').insert({
            actor_id: user.id,
            action: 'TEACHER_LOGOUT',
            entity_type: 'teacher_profiles',
            entity_id: user.id,
            metadata: { timestamp: new Date().toISOString() },
          });
        }
      } catch {
        // Continue with signOut even if activity log fails
      }
      await supabase.auth.signOut();
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured) {
      return {
        id: 'b1111111-1111-1111-1111-111111111111',
        email: 'teacher@test.local',
        fullName: 'ABC',
        role: 'teacher',
        facultyId: 'FAC001',
        department: 'Computer Science & Engineering',
        status: 'active',
      };
    }

    try {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return null;

      const { data: roleData } = await (supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'teacher')
        .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

      if (!roleData) return null;

      const { data: teacherProfile } = await (supabase
        .from('teacher_profiles')
        .select('faculty_id, status, departments(name)')
        .eq('user_id', data.user.id)
        .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

      if (!teacherProfile || teacherProfile.status !== 'active') {
        return null; // Suspended/inactive teacher treated as unauthenticated
      }

      const { data: profile } = await (supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

      const deptName = (teacherProfile.departments as { name: string } | undefined)?.name || 'Computer Science & Engineering';

      return {
        id: data.user.id,
        email: data.user.email || '',
        fullName: (profile?.full_name as string) || 'Faculty Member',
        role: 'teacher',
        facultyId: (teacherProfile.faculty_id as string) || 'FAC001',
        department: deptName,
        status: teacherProfile.status as string,
      };
    } catch {
      return null;
    }
  },
};
