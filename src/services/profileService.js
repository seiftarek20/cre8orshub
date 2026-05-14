import { requireSupabaseClient } from '../lib/supabaseClient.js';

export async function getCurrentUserProfile(userId) {
  if (!userId) return null;

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, avatar_url, role, bio, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateCurrentUserProfile(userId, updates) {
  const supabase = requireSupabaseClient();
  const payload = {
    full_name: updates.full_name || null,
    phone: updates.phone || null,
    bio: updates.bio || null,
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select('id, full_name, email, phone, avatar_url, role, bio, created_at, updated_at')
    .single();

  if (error) throw error;
  return data;
}
