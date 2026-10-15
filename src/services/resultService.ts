import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface StudentResultItem {
  id: string;
  studentId: string;
  studentName: string;
  rrn: string;
  rollNumber?: string | null;
  assessmentTitle: string;
  score: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  status: string;
  submittedAt: string;
}

const mockResults: StudentResultItem[] = [
  { id: '1', studentId: '1', studentName: 'Aarav Sharma', rrn: 'RRN2024AI001', rollNumber: '24AI001', assessmentTitle: 'Python Core & Algorithms Assessment', score: 6, maxMarks: 6, percentage: 100, grade: 'A+', status: 'Passed', submittedAt: new Date().toISOString() },
  { id: '2', studentId: '2', studentName: 'Ananya Iyer', rrn: 'RRN2024AI002', rollNumber: '24AI002', assessmentTitle: 'Python Core & Algorithms Assessment', score: 5, maxMarks: 6, percentage: 83.33, grade: 'A', status: 'Passed', submittedAt: new Date().toISOString() },
  { id: '3', studentId: '3', studentName: 'Karthik Rajan', rrn: 'RRN2024AI003', rollNumber: '24AI003', assessmentTitle: 'Python Core & Algorithms Assessment', score: 4, maxMarks: 6, percentage: 66.67, grade: 'B', status: 'Passed', submittedAt: new Date().toISOString() },
  { id: '4', studentId: '4', studentName: 'Meera Nair', rrn: 'RRN2024AI004', rollNumber: '24AI004', assessmentTitle: 'Python Core & Algorithms Assessment', score: 5, maxMarks: 6, percentage: 83.33, grade: 'A', status: 'Passed', submittedAt: new Date().toISOString() },
  { id: '5', studentId: '5', studentName: 'Rohit Verma', rrn: 'RRN2024AI005', rollNumber: '24AI005', assessmentTitle: 'Python Core & Algorithms Assessment', score: 2, maxMarks: 6, percentage: 33.33, grade: 'F', status: 'Failed', submittedAt: new Date().toISOString() },
  { id: '6', studentId: '6', studentName: 'Sneha Patel', rrn: 'RRN2024AI006', rollNumber: '24AI006', assessmentTitle: 'Python Core & Algorithms Assessment', score: 5, maxMarks: 6, percentage: 83.33, grade: 'A', status: 'Passed', submittedAt: new Date().toISOString() },
];

export const resultService = {
  async getAssessmentResults(assessmentId?: string) {
    if (!isSupabaseConfigured) {
      return { data: mockResults, error: null };
    }

    let q = supabase
      .from('results')
      .select(`
        id,
        score,
        max_marks,
        percentage,
        grade,
        is_passed,
        published_at,
        created_at,
        student_id,
        student_profiles(
          id,
          rrn,
          roll_number,
          profiles(full_name)
        ),
        assessments(title)
      `)
      .order('percentage', { ascending: false });

    if (assessmentId && assessmentId !== 'all') {
      q = q.eq('assessment_id', assessmentId);
    }

    const { data, error } = await (q as unknown as Promise<{ data: Array<Record<string, unknown>> | null; error: Error | null }>);
    if (error) return { data: mockResults, error: error.message };

    const formatted: StudentResultItem[] = (data || []).map((item) => {
      const sp = item.student_profiles as {
        id: string;
        rrn: string;
        roll_number: string | null;
        profiles: { full_name: string };
      } | undefined;
      const ass = item.assessments as { title: string } | undefined;

      return {
        id: item.id as string,
        studentId: sp?.id || (item.student_id as string),
        studentName: sp?.profiles?.full_name || 'Student',
        rrn: sp?.rrn || 'RRN000',
        rollNumber: sp?.roll_number,
        assessmentTitle: ass?.title || 'Assessment',
        score: Number(item.score),
        maxMarks: Number(item.max_marks),
        percentage: Number(item.percentage),
        grade: item.grade as string,
        status: item.is_passed ? 'Passed' : 'Failed',
        submittedAt: (item.published_at as string) || (item.created_at as string),
      };
    });

    return { data: formatted.length > 0 ? formatted : mockResults, error: null };
  },

  async getResultStatistics(results: StudentResultItem[]) {
    if (results.length === 0) {
      return {
        completed: 0,
        averagePercentage: 0,
        highestScore: 0,
        lowestScore: 0,
        passRate: 0,
      };
    }

    const completed = results.length;
    const scores = results.map(r => r.score);
    const percentages = results.map(r => r.percentage);
    const passed = results.filter(r => r.status === 'Passed').length;

    const avg = percentages.reduce((a, b) => a + b, 0) / completed;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passRate = Math.round((passed / completed) * 100);

    return {
      completed,
      averagePercentage: Math.round(avg * 10) / 10,
      highestScore: highest,
      lowestScore: lowest,
      passRate,
    };
  },
};
