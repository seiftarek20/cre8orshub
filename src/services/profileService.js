import { requireSupabaseClient } from '../lib/supabaseClient.js';
import { sanitizeLongText, sanitizeText, toSafeSupabaseError } from '../utils/security.js';

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
    full_name: sanitizeText(updates.full_name, { maxLength: 120 }) || null,
    phone: sanitizeText(updates.phone, { maxLength: 40 }) || null,
    bio: sanitizeLongText(updates.bio, { maxLength: 1200 }) || null,
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select('id, full_name, email, phone, avatar_url, role, bio, created_at, updated_at')
    .single();

  if (error) throw toSafeSupabaseError(error, 'Could not update your profile.');
  return data;
}
