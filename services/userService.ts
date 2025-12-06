import { supabase } from '../lib/supabaseClient';
import { UserProfile, Passport } from '../types';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ 
      id: userId, 
      ...updates,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const uploadUserAvatar = async (userId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // 2. Get Public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    
    if (!data || !data.publicUrl) {
        throw new Error('Error getting public URL');
    }

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

export const getUserPassport = async (userId: string): Promise<Passport | null> => {
  const { data, error } = await supabase
    .from('passports')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
    console.error('Error fetching passport:', error);
  }
  return data || null;
};

export const upsertUserPassport = async (userId: string, passportData: Partial<Passport>) => {
  const { data, error } = await supabase
    .from('passports')
    .upsert({ user_id: userId, ...passportData })
    .select()
    .single();

  if (error) throw error;
  return data;
};