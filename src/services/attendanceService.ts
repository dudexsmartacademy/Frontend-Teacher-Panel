import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AttendanceStatus } from '../types/database.types';

export interface StudentAttendanceEntry {
  studentId: string;
  rrn: string;
  name: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  time?: string;
  remarks?: string;
}

export interface SaveAttendancePayload {
  teacherId: string;
  classId: string;
  subjectId?: string;
  subject: string;
  session: string;
  date: string;
  attendance: StudentAttendanceEntry[];
}

export const attendanceService = {
  async saveAttendance(payload: SaveAttendancePayload) {
    if (!isSupabaseConfigured) {
      console.log('[Mock Attendance Save]:', payload);
      return {
        success: true,
        session_id: 'mock-session-id',
        recordCount: payload.attendance.length,
        error: null,
      };
    }

    try {
      // 1. Get current teacher profile ID
      const { data: teacherProf, error: teacherErr } = await (supabase
        .from('teacher_profiles')
        .select('id')
        .limit(1)
        .maybeSingle() as unknown as Promise<{ data: { id: string } | null; error: Error | null }>);

      if (teacherErr || !teacherProf) {
        throw new Error('Teacher profile not found or unauthorized.');
      }

      // 2. Create or find class_session for today's class
      const { data: session, error: sessErr } = await (supabase
        .from('class_sessions')
        .insert({
          class_id: payload.classId,
          teacher_id: teacherProf.id,
          session_date: payload.date,
          mode: 'offline',
          room: payload.session || 'Main Lecture Hall',
        })
        .select('id')
        .single() as unknown as Promise<{ data: { id: string } | null; error: Error | null }>);

      if (sessErr || !session) {
        throw new Error(`Failed to create class session: ${sessErr?.message}`);
      }

      // 3. Map attendance status values
      const statusMap: Record<string, AttendanceStatus> = {
        Present: 'present',
        Absent: 'absent',
        Late: 'late',
        Excused: 'excused',
      };

      const recordsToInsert = payload.attendance.map((att) => ({
        session_id: session.id,
        student_id: att.studentId,
        status: statusMap[att.status] || 'present',
        marked_by: teacherProf.id,
        remarks: att.remarks || null,
      }));

      // 4. Upsert attendance records
      const { error: recordsErr } = await supabase
        .from('attendance_records')
        .upsert(recordsToInsert, { onConflict: 'session_id,student_id' });

      if (recordsErr) {
        throw new Error(`Failed to save attendance records: ${recordsErr.message}`);
      }

      // 5. Create activity log entry
      const user = (await supabase.auth.getUser()).data.user;
      await supabase.from('activity_logs').insert({
        actor_id: user?.id || teacherProf.id,
        action: 'ATTENDANCE_MARKED',
        entity_type: 'class_sessions',
        entity_id: session.id,
        metadata: {
          class_id: payload.classId,
          subject: payload.subject,
          date: payload.date,
          count: payload.attendance.length,
        },
      });

      return {
        success: true,
        session_id: session.id,
        recordCount: payload.attendance.length,
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown attendance error';
      return { success: false, session_id: null, recordCount: 0, error: msg };
    }
  },

  async getClassAttendanceSummary(classId: string) {
    if (!isSupabaseConfigured) {
      return {
        class_id: classId,
        total_sessions: 45,
        enrolled_students: 60,
        average_percentage: 88.5,
      };
    }

    const { data, error } = await (supabase.rpc('get_class_attendance_summary', {
      p_class_id: classId,
    } as unknown as Record<string, unknown>) as unknown as Promise<{ data: Array<{ class_id: string; total_sessions: number; enrolled_students: number; average_percentage: number }> | null; error: Error | null }>);

    if (error || !data || data.length === 0) {
      return {
        class_id: classId,
        total_sessions: 0,
        enrolled_students: 0,
        average_percentage: 0,
      };
    }

    return data[0];
  },

  async getStudentAttendanceSummary(studentId: string) {
    if (!isSupabaseConfigured) {
      return {
        total_sessions: 45,
        present_count: 40,
        absent_count: 3,
        late_count: 2,
        excused_count: 0,
        percentage: 91.1,
      };
    }

    const { data, error } = await (supabase.rpc('get_student_attendance_summary', {
      p_student_id: studentId,
    } as unknown as Record<string, unknown>) as unknown as Promise<{ data: Array<{ total_sessions: number; present_count: number; absent_count: number; late_count: number; excused_count: number; percentage: number }> | null; error: Error | null }>);

    if (error || !data || data.length === 0) {
      return {
        total_sessions: 0,
        present_count: 0,
        absent_count: 0,
        late_count: 0,
        excused_count: 0,
        percentage: 0,
      };
    }

    return data[0];
  },
};
