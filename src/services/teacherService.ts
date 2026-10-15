import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { teacherProfile as mockProfile, teacherAssignments as mockAssignments } from '../data/teacher/teacherData';

export interface TeacherAssignmentItem {
  id: string;
  classId: string;
  className: string;
  subjectId?: string;
  subject: string;
  academicYear: string;
  active: boolean;
}

const fallbackAssignments: TeacherAssignmentItem[] = mockAssignments.map((a, i) => ({
  id: `assign-${i + 1}`,
  classId: a.classId,
  className: a.className,
  subject: a.subject,
  academicYear: a.academicYear,
  active: a.active,
}));

export const teacherService = {
  async getProfile() {
    if (!isSupabaseConfigured) {
      return { data: mockProfile, error: null };
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return { data: mockProfile, error: null };

    const { data, error } = await (supabase
      .from('teacher_profiles')
      .select(`
        id,
        faculty_id,
        designation,
        phone,
        qualification,
        status,
        profiles(full_name, email),
        departments(name)
      `)
      .eq('user_id', user.user.id)
      .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

    if (error || !data) {
      return { data: mockProfile, error: error?.message || 'Profile not found' };
    }

    const profileData = data.profiles as { full_name: string; email: string } | undefined;
    const deptData = data.departments as { name: string } | undefined;

    return {
      data: {
        id: data.id as string,
        name: profileData?.full_name || mockProfile.name,
        facultyId: data.faculty_id as string,
        department: deptData?.name || mockProfile.department,
        designation: (data.designation as string) || 'Assistant Professor',
        phone: (data.phone as string) || null,
        qualification: (data.qualification as string) || null,
      },
      error: null,
    };
  },

  async getAssignments(): Promise<{ data: TeacherAssignmentItem[]; error: string | null }> {
    if (!isSupabaseConfigured) {
      return { data: fallbackAssignments, error: null };
    }

    const { data, error } = await (supabase
      .from('teacher_assignments')
      .select(`
        id,
        class_id,
        subject_id,
        is_active,
        classes(id, name),
        subjects(id, name),
        academic_years(name)
      `)
      .eq('is_active', true) as unknown as Promise<{ data: Array<Record<string, unknown>> | null; error: Error | null }>);

    if (error) {
      return { data: fallbackAssignments, error: error.message };
    }

    if (!data || data.length === 0) {
      return { data: fallbackAssignments, error: null };
    }

    const assignments: TeacherAssignmentItem[] = data.map((item) => {
      const cls = item.classes as { id: string; name: string } | undefined;
      const sub = item.subjects as { id: string; name: string } | undefined;
      const ay = item.academic_years as { name: string } | undefined;

      return {
        id: item.id as string,
        classId: cls?.id || (item.class_id as string),
        className: cls?.name || 'Class',
        subjectId: sub?.id || (item.subject_id as string) || '',
        subject: sub?.name || 'Subject',
        academicYear: ay?.name || '2024–2028',
        active: Boolean(item.is_active),
      };
    });

    return { data: assignments, error: null };
  },

  async getDashboardMetrics() {
    if (!isSupabaseConfigured) {
      return {
        assignedClasses: 3,
        assignedStudents: 184,
        todaysClasses: 3,
        attendancePending: 1,
        activeAssessments: 2,
        averageClassPerformance: 78,
        studentsAtRisk: 8,
      };
    }

    try {
      const [{ count: classCount }, { count: studentCount }, { count: assessmentCount }] = await Promise.all([
        supabase.from('teacher_assignments').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('class_memberships').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('assessments').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      ]);

      return {
        assignedClasses: classCount ?? 3,
        assignedStudents: studentCount ?? 184,
        todaysClasses: 3,
        attendancePending: 1,
        activeAssessments: assessmentCount ?? 2,
        averageClassPerformance: 78,
        studentsAtRisk: 8,
      };
    } catch {
      return {
        assignedClasses: 3,
        assignedStudents: 184,
        todaysClasses: 3,
        attendancePending: 1,
        activeAssessments: 2,
        averageClassPerformance: 78,
        studentsAtRisk: 8,
      };
    }
  },
};
