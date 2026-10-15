import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Json } from '../types/database.types';

export const activityService = {
  async logActivity(action: string, entityType: string, entityId?: string, metadata: Json = {}) {
    if (!isSupabaseConfigured) {
      console.log(`[Activity Log]: ${action} on ${entityType} (${entityId})`, metadata);
      return { success: true };
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return { success: false };

      await supabase.from('activity_logs').insert({
        actor_id: user.user.id,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        metadata,
      });

      return { success: true };
    } catch {
      return { success: false };
    }
  },

  async getRecentActivities(limit: number = 20) {
    if (!isSupabaseConfigured) {
      return {
        data: [
          { id: '1', action: 'ATTENDANCE_MARKED', entityType: 'class_sessions', createdAt: new Date().toISOString() },
          { id: '2', action: 'NOTE_CREATED', entityType: 'notes', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: '3', action: 'ASSESSMENT_CREATED', entityType: 'assessments', createdAt: new Date(Date.now() - 7200000).toISOString() },
        ],
        error: null,
      };
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: [], error: error.message };
    return { data, error: null };
  },
};
