import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { LiveClassStatus } from '../types/database.types';

export interface LiveClassItem {
  id: string;
  title: string;
  description?: string | null;
  classId: string;
  className?: string;
  subjectName?: string;
  meetingPlatform: string;
  meetingUrl: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: LiveClassStatus;
}

const mockLiveClasses: LiveClassItem[] = [
  {
    id: '1',
    title: 'Python OOP & Placement Problem Solving',
    description: 'Deep dive into Object-Oriented Design, inheritance, and company interview problems.',
    classId: '1',
    className: 'AI & DS - Section B',
    subjectName: 'Python',
    meetingPlatform: 'Google Meet',
    meetingUrl: 'https://meet.google.com/dudex-aids-live',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Binary Trees & Heap Algorithms',
    description: 'Tree traversals, HeapSort, and priority queue implementation.',
    classId: '2',
    className: 'AI & DS - Section A',
    subjectName: 'Data Structures',
    meetingPlatform: 'Google Meet',
    meetingUrl: 'https://meet.google.com/dudex-ds-live',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    status: 'scheduled',
  },
];

export const liveClassService = {
  async getLiveClasses() {
    if (!isSupabaseConfigured) {
      return { data: mockLiveClasses, error: null };
    }

    const { data, error } = await (supabase
      .from('live_classes')
      .select(`
        id,
        title,
        description,
        class_id,
        meeting_platform,
        meeting_url,
        scheduled_date,
        start_time,
        end_time,
        status,
        classes(name),
        course_offerings(subjects(name))
      `)
      .order('scheduled_date', { ascending: false }) as unknown as Promise<{ data: Array<Record<string, unknown>> | null; error: Error | null }>);

    if (error) {
      return { data: mockLiveClasses, error: error.message };
    }

    const formatted: LiveClassItem[] = (data || []).map((item) => {
      const cls = item.classes as { name: string } | undefined;
      const co = item.course_offerings as { subjects: { name: string } } | undefined;

      return {
        id: item.id as string,
        title: item.title as string,
        description: (item.description as string) || null,
        classId: item.class_id as string,
        className: cls?.name || 'Assigned Class',
        subjectName: co?.subjects?.name || 'Course Subject',
        meetingPlatform: (item.meeting_platform as string) || 'Google Meet',
        meetingUrl: item.meeting_url as string,
        scheduledDate: item.scheduled_date as string,
        startTime: item.start_time as string,
        endTime: item.end_time as string,
        status: item.status as LiveClassStatus,
      };
    });

    return { data: formatted.length > 0 ? formatted : mockLiveClasses, error: null };
  },

  async createLiveClass(input: {
    classId: string;
    title: string;
    description?: string;
    meetingPlatform: string;
    meetingUrl: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
  }) {
    if (!isSupabaseConfigured) {
      const newClass: LiveClassItem = {
        id: `mock-${Date.now()}`,
        ...input,
        status: 'scheduled',
      };
      mockLiveClasses.unshift(newClass);
      return { data: newClass, error: null };
    }

    const { data: teacherProf } = await (supabase
      .from('teacher_profiles')
      .select('id')
      .limit(1)
      .single() as unknown as Promise<{ data: { id: string } | null; error: Error | null }>);

    if (!teacherProf) {
      return { data: null, error: 'Teacher profile required' };
    }

    const { data, error } = await (supabase
      .from('live_classes')
      .insert({
        class_id: input.classId,
        teacher_id: teacherProf.id,
        title: input.title,
        description: input.description,
        meeting_platform: input.meetingPlatform || 'Google Meet',
        meeting_url: input.meetingUrl,
        scheduled_date: input.scheduledDate,
        start_time: input.startTime,
        end_time: input.endTime,
        status: 'scheduled',
      })
      .select()
      .single() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

    if (error) return { data: null, error: error.message };

    return { data, error: null };
  },

  async updateLiveClass(id: string, updates: Partial<LiveClassItem>) {
    if (!isSupabaseConfigured) {
      return { success: true, error: null };
    }

    const dbUpdates: Record<string, unknown> = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.meetingUrl) dbUpdates.meeting_url = updates.meetingUrl;
    if (updates.scheduledDate) dbUpdates.scheduled_date = updates.scheduledDate;
    if (updates.startTime) dbUpdates.start_time = updates.startTime;
    if (updates.endTime) dbUpdates.end_time = updates.endTime;
    if (updates.status) dbUpdates.status = updates.status;

    const { error } = await supabase
      .from('live_classes')
      .update(dbUpdates)
      .eq('id', id);

    return { success: !error, error: error?.message || null };
  },
};
