import { supabase } from '@/config/supabase';

export interface Reminder {
  id?: string;
  userId: string;
  name: string;
  type: string;
  frequency: string;
  description?: string;
  times: string[];
  createdAt?: Date;
}

const TABLE_NAME = 'reminders';

export const reminderService = {
  async addReminder(reminder: Omit<Reminder, 'id' | 'createdAt'>): Promise<string> {
    if (!reminder.times?.length) {
      throw new Error('At least one reminder time is required');
    }

    const now = new Date();
    const payload = {
      user_id: reminder.userId,
      name: reminder.name,
      type: reminder.type,
      frequency: reminder.frequency,
      description: reminder.description || null,
      times: reminder.times,
      created_at: now,
    };

    const { data, error } = await supabase.from(TABLE_NAME).insert([payload]).select();
    if (error) {
      console.error('[ReminderService] Insert error:', error);
      throw error;
    }
    const id = data?.[0]?.id as string;
    return id;
  },

  async getReminders(userId: string): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ReminderService] Fetch error:', error);
      throw error;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: row.type,
      frequency: row.frequency,
      description: row.description || undefined,
      times: row.times || [],
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
    }));
  },
};
