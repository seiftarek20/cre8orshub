import { requireSupabaseClient } from '../lib/supabaseClient.js';

// Phase 1 placeholder:
// Add profile reads and updates here after the profiles table and RLS policies exist.
export async function getCurrentUserProfile(userId) {
  const supabase = requireSupabaseClient();
  return supabase.from('profiles').select('*').eq('id', userId).single();
}
