import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  linkUrl?: string | null;
  readAt?: string | null;
  createdAt: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Live Class Scheduled',
    message: 'Python OOP live placement class scheduled for today at 10:00 AM.',
    type: 'live_class',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Daily Notes Published',
    message: 'Notes for Python Basics and Interview Q&A have been uploaded.',
    type: 'note',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Assessment Submissions Ready',
    message: '6 students submitted Python Core & Algorithms assessment.',
    type: 'result',
    createdAt: new Date().toISOString(),
  },
];

export const notificationService = {
  async getNotifications() {
    if (!isSupabaseConfigured) {
      return { data: mockNotifications, error: null };
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return { data: mockNotifications, error: null };

    const { data, error } = await (supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.user.id)
      .order('created_at', { ascending: false }) as unknown as Promise<{ data: Array<Record<string, unknown>> | null; error: Error | null }>);

    if (error) return { data: mockNotifications, error: error.message };

    const formatted: NotificationItem[] = (data || []).map((n) => ({
      id: n.id as string,
      title: n.title as string,
      message: n.message as string,
      type: (n.notification_type as string) || 'general',
      linkUrl: (n.link_url as string) || null,
      readAt: (n.read_at as string) || null,
      createdAt: n.created_at as string,
    }));

    return { data: formatted.length > 0 ? formatted : mockNotifications, error: null };
  },

  async markAsRead(id: string) {
    if (!isSupabaseConfigured) {
      const target = mockNotifications.find(n => n.id === id);
      if (target) target.readAt = new Date().toISOString();
      return { success: true };
    }

    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);

    return { success: true };
  },
};
