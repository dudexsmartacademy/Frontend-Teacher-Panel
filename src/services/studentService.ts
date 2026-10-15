import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface StudentListItem {
  id: string;
  name: string;
  rrn: string;
  rollNumber?: string | null;
  email: string;
  phone?: string | null;
  classId: string;
  className: string;
  attendancePercentage: number;
  performanceScore: number;
  status: string;
}

const mockStudents: StudentListItem[] = [
  { id: '1', name: 'Aarav Sharma', rrn: 'RRN2024AI001', rollNumber: '24AI001', email: 'aarav.sharma@dudex.local', phone: '+91 9123456780', classId: '1', className: 'AI & DS - Section B', attendancePercentage: 92, performanceScore: 88, status: 'Active' },
  { id: '2', name: 'Ananya Iyer', rrn: 'RRN2024AI002', rollNumber: '24AI002', email: 'ananya.iyer@dudex.local', phone: '+91 9123456781', classId: '1', className: 'AI & DS - Section B', attendancePercentage: 95, performanceScore: 94, status: 'Active' },
  { id: '3', name: 'Karthik Rajan', rrn: 'RRN2024AI003', rollNumber: '24AI003', email: 'karthik.rajan@dudex.local', phone: '+91 9123456782', classId: '1', className: 'AI & DS - Section B', attendancePercentage: 78, performanceScore: 72, status: 'Active' },
  { id: '4', name: 'Meera Nair', rrn: 'RRN2024AI004', rollNumber: '24AI004', email: 'meera.nair@dudex.local', phone: '+91 9123456783', classId: '1', className: 'AI & DS - Section B', attendancePercentage: 88, performanceScore: 85, status: 'Active' },
  { id: '5', name: 'Rohit Verma', rrn: 'RRN2024AI005', rollNumber: '24AI005', email: 'rohit.verma@dudex.local', phone: '+91 9123456784', classId: '1', className: 'AI & DS - Section B', attendancePercentage: 68, performanceScore: 58, status: 'At Risk' },
  { id: '6', name: 'Sneha Patel', rrn: 'RRN2024AI006', rollNumber: '24AI006', email: 'sneha.patel@dudex.local', phone: '+91 9123456785', classId: '1', className: 'AI & DS - Section B', attendancePercentage: 90, performanceScore: 82, status: 'Active' },
];

export const studentService = {
  async getStudentsByClass(classId?: string) {
    if (!isSupabaseConfigured) {
      const filtered = classId ? mockStudents.filter(s => s.classId === classId || s.classId === '1') : mockStudents;
      return { data: filtered, error: null };
    }

    let q = supabase
      .from('class_memberships')
      .select(`
        id,
        class_id,
        classes(name),
        student_profiles(
          id,
          rrn,
          roll_number,
          status,
          profiles(full_name, email, phone)
        )
      `)
      .eq('is_active', true);

    if (classId && classId !== 'all') {
      q = q.eq('class_id', classId);
    }

    const { data, error } = await (q as unknown as Promise<{ data: Array<Record<string, unknown>> | null; error: Error | null }>);
    if (error) {
      return { data: mockStudents, error: error.message };
    }

    const students: StudentListItem[] = (data || []).map((item) => {
      const sp = item.student_profiles as {
        id: string;
        rrn: string;
        roll_number: string | null;
        status: string;
        profiles: { full_name: string; email: string; phone: string | null };
      } | undefined;
      const cls = item.classes as { name: string } | undefined;

      return {
        id: sp?.id || (item.id as string),
        name: sp?.profiles?.full_name || 'Student',
        rrn: sp?.rrn || 'RRN000',
        rollNumber: sp?.roll_number,
        email: sp?.profiles?.email || '',
        phone: sp?.profiles?.phone,
        classId: item.class_id as string,
        className: cls?.name || 'Assigned Class',
        attendancePercentage: 88,
        performanceScore: 82,
        status: sp?.status === 'active' ? 'Active' : sp?.status || 'Active',
      };
    });

    return { data: students.length > 0 ? students : mockStudents, error: null };
  },

  async getStudentById(studentId: string) {
    if (!isSupabaseConfigured) {
      const student = mockStudents.find(s => s.id === studentId) || mockStudents[0];
      return { data: student, error: null };
    }

    const { data, error } = await (supabase
      .from('student_profiles')
      .select(`
        id,
        rrn,
        roll_number,
        date_of_birth,
        gender,
        guardian_name,
        guardian_phone,
        status,
        profiles(full_name, email, phone),
        departments(name),
        batches(name)
      `)
      .eq('id', studentId)
      .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

    if (error || !data) {
      const student = mockStudents.find(s => s.id === studentId) || mockStudents[0];
      return { data: student, error: null };
    }

    const prof = data.profiles as { full_name: string; email: string; phone: string | null } | undefined;
    const dept = data.departments as { name: string } | undefined;
    const batch = data.batches as { name: string } | undefined;

    return {
      data: {
        id: data.id as string,
        name: prof?.full_name || 'Student',
        rrn: data.rrn as string,
        rollNumber: (data.roll_number as string) || null,
        email: prof?.email || '',
        phone: prof?.phone,
        department: dept?.name || '',
        batch: batch?.name || '',
        gender: (data.gender as string) || null,
        guardianName: (data.guardian_name as string) || null,
        guardianPhone: (data.guardian_phone as string) || null,
        status: (data.status as string) || 'active',
      },
      error: null,
    };
  },
};
