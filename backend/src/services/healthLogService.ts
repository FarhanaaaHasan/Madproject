import { supabase } from '../config/supabase';
import { HealthLog } from '../types';

const TABLE_NAME = 'health_logs';

export class HealthLogService {
  // Add new health log
  async addHealthLog(
    healthLog: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date();
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([
          {
            ...healthLog,
            created_at: now,
            updated_at: now,
          },
        ])
        .select();

      if (error) throw error;

      const id = data?.[0]?.id;
      console.log('[HealthLogService] Added health log:', id);
      return id;
    } catch (error) {
      console.error('[HealthLogService] Error adding health log:', error);
      throw error;
    }
  }

  // Get all health logs for a user (optionally by type)
  async getUserHealthLogs(userId: string, type?: string): Promise<HealthLog[]> {
    try {
      let query = supabase.from(TABLE_NAME).select('*').eq('user_id', userId);
      if (type) {
        query = query.eq('type', type);
      }
      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;

      const healthLogs: HealthLog[] = (data || []).map((doc) => ({
        id: doc.id,
        ...doc,
        createdAt: new Date(doc.created_at),
        updatedAt: new Date(doc.updated_at),
      } as HealthLog));

      console.log('[HealthLogService] Retrieved health logs:', healthLogs.length);
      return healthLogs;
    } catch (error) {
      console.error('[HealthLogService] Error getting health logs:', error);
      throw error;
    }
  }

  // Get single health log by ID
  async getHealthLogById(id: string): Promise<HealthLog | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        return {
          id: data.id,
          ...data,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        } as HealthLog;
      }
      return null;
    } catch (error) {
      console.error('[HealthLogService] Error getting health log:', error);
      throw error;
    }
  }

  // Update health log
  async updateHealthLog(
    id: string,
    updates: Partial<Omit<HealthLog, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          ...updates,
          updated_at: new Date(),
        })
        .eq('id', id);

      if (error) throw error;

      console.log('[HealthLogService] Updated health log:', id);
    } catch (error) {
      console.error('[HealthLogService] Error updating health log:', error);
      throw error;
    }
  }

  // Delete health log
  async deleteHealthLog(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('[HealthLogService] Deleted health log:', id);
    } catch (error) {
      console.error('[HealthLogService] Error deleting health log:', error);
      throw error;
    }
  }
}

export const healthLogService = new HealthLogService();
