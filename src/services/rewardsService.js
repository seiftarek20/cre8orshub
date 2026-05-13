import { requireSupabaseClient } from '../lib/supabaseClient.js';

// Phase 1 placeholder:
// Add reward point totals and badge queries here after rewards tables are created.
export async function getStudentRewards(studentId) {
  const supabase = requireSupabaseClient();
  return supabase.from('reward_points').select('*').eq('student_id', studentId);
}
