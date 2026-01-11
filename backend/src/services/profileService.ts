import { supabase } from '../config/supabase';
import { UserProfile } from '../types';

const TABLE_NAME = 'user_profiles';

export class ProfileService {
  // Create or update user profile
  async saveProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const now = new Date();
      
      // Check if profile exists
      const { data: existingProfile, error: selectError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', profile.userId)
        .single();
      
      if (selectError && selectError.code !== 'PGRST116') throw selectError;
      
      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from(TABLE_NAME)
          .update({
            ...profile,
            updated_at: now,
          })
          .eq('user_id', profile.userId);
        
        if (error) throw error;
        console.log('[ProfileService] Updated profile:', profile.userId);
      } else {
        // Create new profile
        const { error } = await supabase
          .from(TABLE_NAME)
          .insert([{
            ...profile,
            created_at: now,
            updated_at: now,
          }]);
        
        if (error) throw error;
        console.log('[ProfileService] Created new profile:', profile.userId);
      }
    } catch (error) {
      console.error('[ProfileService] Error saving profile:', error);
      throw error;
    }
  }

  // Get user profile by userId
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        console.log('[ProfileService] Retrieved profile data');
        return {
          id: data.id,
          ...data,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        } as UserProfile;
      }
      console.log('[ProfileService] No profile found for userId:', userId);
      return null;
    } catch (error) {
      console.error('[ProfileService] Error getting profile:', error);
      throw error;
    }
  }

  // Update specific profile fields
  async updateProfileField(
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          ...updates,
          updated_at: new Date(),
        })
        .eq('user_id', userId);

      if (error) throw error;
      console.log('[ProfileService] Updated profile fields:', userId);
    } catch (error) {
      console.error('[ProfileService] Error updating profile fields:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
