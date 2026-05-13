import { requireSupabaseClient } from '../lib/supabaseClient.js';

// Phase 1 placeholder:
// Add signup, login, logout, session, and password reset calls here when auth UI is implemented.
export async function getCurrentSession() {
  const supabase = requireSupabaseClient();
  return supabase.auth.getSession();
}
