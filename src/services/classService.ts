import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface ClassDetails {
  id: string;
  name: string;
  code?: string | null;
  semester: number;
  departmentName: string;
  academicYear: string;
  batchName: string;
  sectionName: string;
}

export const classService = {
  async getClasses() {
    if (!isSupabaseConfigured) {
      return {
        data: [
          { id: '1', name: 'AI & DS - Section B', academicYear: '2024–2028', department: 'AI & DS', semester: 2 },
          { id: '2', name: 'AI & DS - Section A', academicYear: '2024–2028', department: 'AI & DS', semester: 2 },
          { id: '3', name: 'CSE - Section A', academicYear: '2023–2027', department: 'CSE', semester: 4 },
        ],
        error: null,
      };
    }

    const { data, error } = await (supabase
      .from('classes')
      .select(`
        id,
        name,
        code,
        semester,
        departments(name),
        academic_years(name),
        batches(name),
        sections(name)
      `)
      .eq('is_active', true) as unknown as Promise<{ data: Array<Record<string, unknown>> | null; error: Error | null }>);

    if (error) {
      return { data: [], error: error.message };
    }

    const formatted = (data || []).map((c) => ({
      id: c.id as string,
      name: c.name as string,
      code: (c.code as string) || null,
      semester: Number(c.semester),
      department: (c.departments as { name: string })?.name || '',
      academicYear: (c.academic_years as { name: string })?.name || '',
      batch: (c.batches as { name: string })?.name || '',
      section: (c.sections as { name: string })?.name || '',
    }));

    return { data: formatted, error: null };
  },

  async getClassById(classId: string) {
    if (!isSupabaseConfigured) {
      return {
        data: {
          id: classId,
          name: classId === '1' ? 'AI & DS - Section B' : classId === '2' ? 'AI & DS - Section A' : 'CSE - Section A',
          academicYear: '2024–2028',
          departmentName: 'Artificial Intelligence & Data Science',
          batchName: '2024–2028',
          sectionName: 'Section B',
          semester: 2,
        },
        error: null,
      };
    }

    const { data, error } = await (supabase
      .from('classes')
      .select(`
        id,
        name,
        code,
        semester,
        departments(name),
        academic_years(name),
        batches(name),
        sections(name)
      `)
      .eq('id', classId)
      .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

    if (error || !data) {
      return { data: null, error: error?.message || 'Class not found' };
    }

    return {
      data: {
        id: data.id as string,
        name: data.name as string,
        code: (data.code as string) || null,
        semester: Number(data.semester),
        departmentName: (data.departments as { name: string })?.name || '',
        academicYear: (data.academic_years as { name: string })?.name || '',
        batchName: (data.batches as { name: string })?.name || '',
        sectionName: (data.sections as { name: string })?.name || '',
      },
      error: null,
    };
  },

  async searchClasses(filters: {
    departmentId?: string;
    batchId?: string;
    sectionId?: string;
    academicYearId?: string;
    query?: string;
  }) {
    if (!isSupabaseConfigured) {
      return this.getClasses();
    }

    let q = supabase
      .from('classes')
      .select(`
        id,
        name,
        code,
        semester,
        departments(name),
        academic_years(name),
        batches(name),
        sections(name)
      `)
      .eq('is_active', true);

    if (filters.departmentId) q = q.eq('department_id', filters.departmentId);
    if (filters.batchId) q = q.eq('batch_id', filters.batchId);
    if (filters.sectionId) q = q.eq('section_id', filters.sectionId);
    if (filters.academicYearId) q = q.eq('academic_year_id', filters.academicYearId);
    if (filters.query) q = q.ilike('name', `%${filters.query}%`);

    const { data, error } = await (q as unknown as Promise<{ data: Array<Record<string, unknown>> | null; error: Error | null }>);
    if (error) return { data: [], error: error.message };

    const formatted = (data || []).map((c) => ({
      id: c.id as string,
      name: c.name as string,
      code: (c.code as string) || null,
      semester: Number(c.semester),
      department: (c.departments as { name: string })?.name || '',
      academicYear: (c.academic_years as { name: string })?.name || '',
      batch: (c.batches as { name: string })?.name || '',
      section: (c.sections as { name: string })?.name || '',
    }));

    return { data: formatted, error: null };
  },
};
